import React from 'react';
import type { ProductionPlan } from '../types';
import { CheckCircleIcon, FilmIcon, CameraIcon, SparklesIcon, BookOpenIcon, UserCircleIcon } from './icons/Icons';

interface ProductionPlanDisplayProps {
    plan: ProductionPlan;
    characterModelImage: string | null;
    generatedKeyframes: (string | null)[];
    generatedVideos: (string | null)[];
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-900/50 flex items-center space-x-3 border-b border-gray-700">
            <div className="text-purple-400">{icon}</div>
            <h3 className="text-xl font-bold text-purple-300">{title}</h3>
        </div>
        <div className="p-6 text-gray-300 space-y-4">{children}</div>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="w-full h-full bg-black rounded-md flex items-center justify-center text-purple-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
);

const ProductionPlanDisplay: React.FC<ProductionPlanDisplayProps> = ({ plan, characterModelImage, generatedKeyframes, generatedVideos }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8">Your Production Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionCard title="1. Character Model Generation" icon={<UserCircleIcon />}>
                    <p className="text-gray-400">{plan.characterModel.action}</p>
                    <p><strong className="text-purple-400">Source:</strong> {plan.characterModel.source}</p>
                     <div className="w-full h-64 object-cover rounded-lg mt-2">
                        {characterModelImage ? (
                            <img src={characterModelImage} alt="Character Model" className="w-full h-full object-cover rounded-lg"/>
                        ) : (
                            <LoadingSpinner />
                        )}
                     </div>
                </SectionCard>

                <SectionCard title="2. Story & Arc Analysis" icon={<SparklesIcon />}>
                    <p><strong className="text-purple-400">Hero:</strong> {plan.storyAnalysis.hero}</p>
                    <p><strong className="text-purple-400">Villain:</strong> {plan.storyAnalysis.villain}</p>
                    <p><strong className="text-purple-400">Core Lesson:</strong> {plan.storyAnalysis.coreLesson}</p>
                    <p className="text-gray-400 italic">"{plan.storyAnalysis.characterArc}"</p>
                </SectionCard>
            </div>
            
            <SectionCard title="3. Episode Script" icon={<BookOpenIcon />}>
                <p className="text-gray-400">{plan.episodeScript.action}</p>
                <div className="space-y-4 mt-4 max-h-96 overflow-y-auto pr-2">
                    {plan.episodeScript.scenes.map(scene => (
                        <div key={scene.scene} className="p-4 bg-gray-900/70 rounded-lg">
                            <h4 className="font-semibold text-purple-400">{scene.title} (Scene {scene.scene})</h4>
                            <p className="text-purple-300 font-medium">Character says: <span className="text-white">"{scene.dialog}"</span></p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="4. Static Keyframe Generation" icon={<CameraIcon />}>
                 <p className="text-gray-400">{plan.staticKeyframes.action}</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                     {plan.staticKeyframes.keyframes.map((kf, index) => (
                         <div key={kf.keyframe} className="bg-gray-900/70 p-3 rounded-lg">
                             <div className="w-full h-40 rounded-md mb-2">
                                 {generatedKeyframes[index] ? (
                                     <img src={generatedKeyframes[index]!} alt={`Keyframe ${kf.keyframe}`} className="w-full h-full object-cover rounded-md"/>
                                 ) : (
                                     <LoadingSpinner />
                                 )}
                             </div>
                             <p className="text-xs text-gray-400"><strong className="text-purple-400">Keyframe {kf.keyframe}:</strong> {kf.prompt}</p>
                         </div>
                     ))}
                 </div>
            </SectionCard>

            <SectionCard title="5. Video Generation (Veo 3)" icon={<FilmIcon />}>
                <p className="text-gray-400">{plan.videoGeneration.action}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                     {plan.videoGeneration.clips.map((clip, index) => (
                         <div key={clip.clip} className="bg-gray-900/70 p-3 rounded-lg">
                             <div className="w-full h-40 bg-black rounded-md mb-2">
                                {generatedVideos[index] ? (
                                    <video src={generatedVideos[index]!} controls autoPlay loop muted className="w-full h-full object-cover rounded-md"></video>
                                ) : (
                                    <LoadingSpinner />
                                )}
                             </div>
                             <p className="text-xs text-gray-400"><strong className="text-purple-400">Clip {clip.clip}:</strong> {clip.prompt}</p>
                         </div>
                     ))}
                 </div>
            </SectionCard>

            <SectionCard title="6. Post-Processing & Audio" icon={<CheckCircleIcon />}>
                <p>{plan.postProcessing.action}</p>
            </SectionCard>
        </div>
    );
};

export default ProductionPlanDisplay;