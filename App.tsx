import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { ProductionPlan } from './types';
import { Language } from './types';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ProductionPlanDisplay from './components/ProductionPlanDisplay';
import CharacterInteraction from './components/CharacterInteraction';
import { generateProductionPlan, generateImage, generateVideo } from './services/geminiService';
import ApiKeySelector from './components/ApiKeySelector';

// This is a mock of the window.aistudio object for development purposes
if (typeof window !== 'undefined' && !(window as any).aistudio) {
  (window as any).aistudio = {
    openSelectKey: async () => {
      console.log("Mock: Opening API key selection dialog.");
      // Simulate user selecting a key
      (window as any).aistudio.selectedKey = true;
      return Promise.resolve();
    },
    hasSelectedApiKey: async () => {
      console.log("Mock: Checking for selected API key.");
      return Promise.resolve((window as any).aistudio.selectedKey || false);
    },
    selectedKey: false,
  };
}

const App: React.FC = () => {
  const [drawingDesc, setDrawingDesc] = useState<string>('');
  const [parentPrompt, setParentPrompt] = useState<string>('');
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [characterImageMimeType, setCharacterImageMimeType] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [hasVeoApiKey, setHasVeoApiKey] = useState(false);

  // New state for generated assets and progress
  const [generationProgress, setGenerationProgress] = useState<string | null>(null);
  const [characterModelImage, setCharacterModelImage] = useState<string | null>(null);
  const [generatedKeyframes, setGeneratedKeyframes] = useState<(string | null)[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<(string | null)[]>([]);


  const checkApiKey = useCallback(async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    setHasVeoApiKey(hasKey);
  }, []);

  useEffect(() => {
    checkApiKey();
    const interval = setInterval(checkApiKey, 2000); // Periodically check for key selection
    return () => clearInterval(interval);
  }, [checkApiKey]);

  const handleGenerate = async () => {
    if (!drawingDesc && !characterImage) {
      setError("Please describe your character or upload an image.");
      return;
    }
     if (!parentPrompt) {
      setError("Please fill in the parent's lesson.");
      return;
    }

    if (!hasVeoApiKey) {
        setError("Please select a Veo API key before generating the story.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setProductionPlan(null);
    setGenerationProgress("Generating production plan...");
    setCharacterModelImage(null);
    setGeneratedKeyframes([]);
    setGeneratedVideos([]);

    try {
      // 1. Generate Production Plan
      const imageBase64 = characterImage ? characterImage.split(',')[1] : null;
      const plan = await generateProductionPlan(drawingDesc, parentPrompt, language, imageBase64, characterImageMimeType);
      setProductionPlan(plan);
      setGeneratedKeyframes(new Array(plan.staticKeyframes.keyframes.length).fill(null));
      setGeneratedVideos(new Array(plan.videoGeneration.clips.length).fill(null));

      // 2. Generate Character Model
      setGenerationProgress("Generating character model...");
      const userImageForGeneration = characterImage ? { data: characterImage.split(',')[1], mimeType: characterImageMimeType! } : undefined;
      const characterPrompt = `${plan.characterModel.action}. The character should be based on this description: "${plan.characterModel.source}"`;
      const charModelImg = await generateImage(characterPrompt, userImageForGeneration);
      setCharacterModelImage(charModelImg);

      // 3. Generate Keyframes sequentially
      const allKeyframes: string[] = [];
      const charModelImgParts = { data: charModelImg.split(',')[1], mimeType: charModelImg.match(/:(.*?);/)?.[1]! };
      for (const [index, kf] of plan.staticKeyframes.keyframes.entries()) {
          setGenerationProgress(`Generating keyframe ${index + 1}/${plan.staticKeyframes.keyframes.length}...`);
          const keyframeImg = await generateImage(kf.prompt, charModelImgParts);
          setGeneratedKeyframes(prev => {
              const newKeyframes = [...prev];
              newKeyframes[index] = keyframeImg;
              return newKeyframes;
          });
          allKeyframes.push(keyframeImg);
      }

      // 4. Generate Videos sequentially
      for (const [index, clip] of plan.videoGeneration.clips.entries()) {
          setGenerationProgress(`Animating clip ${index + 1}/${plan.videoGeneration.clips.length}...`);
          // The clip input is "Static Keyframe #1", so we extract the index.
          const keyframeIndex = parseInt(clip.input.split('#')[1] || '1') - 1;
          const keyframeForVideo = allKeyframes[keyframeIndex];

          const videoUrl = await generateVideo(clip.prompt, keyframeForVideo);
           setGeneratedVideos(prev => {
              const newVideos = [...prev];
              newVideos[index] = videoUrl;
              return newVideos;
          });
      }

      setGenerationProgress("Your story is complete!");

    } catch (e) {
      console.error(e);
      let errorMessage = "An unknown error occurred during generation.";
      if (e instanceof Error) {
        errorMessage = e.message;
        if (errorMessage.includes("API key not valid")) {
            errorMessage = "The provided API key is not valid. Please select a valid key.";
            setHasVeoApiKey(false); // Reset key status on auth error
        } else if(errorMessage.includes("Requested entity was not found")){
            errorMessage = "Project not found or API key is invalid. Please select your API key again.";
            setHasVeoApiKey(false); // Reset key status
        }
      }
      setError(errorMessage);
      setGenerationProgress(null);
    } finally {
      setIsLoading(false);
      setTimeout(() => setGenerationProgress(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-10 border border-gray-700">
          <InputForm
            drawingDesc={drawingDesc}
            setDrawingDesc={setDrawingDesc}
            parentPrompt={parentPrompt}
            setParentPrompt={setParentPrompt}
            language={language}
            setLanguage={setLanguage}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            hasVeoApiKey={hasVeoApiKey}
            characterImage={characterImage}
            setCharacterImage={setCharacterImage}
            setCharacterImageMimeType={setCharacterImageMimeType}
          />
          <ApiKeySelector hasKey={hasVeoApiKey} setHasKey={setHasVeoApiKey} />

          {isLoading && (
            <div className="text-center my-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-4 text-lg text-purple-300">{generationProgress || 'Generating...'}</p>
            </div>
          )}

          {error && (
            <div className="my-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-center">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {productionPlan && (
          <div className="mt-12">
            <ProductionPlanDisplay 
                plan={productionPlan} 
                characterModelImage={characterModelImage}
                generatedKeyframes={generatedKeyframes}
                generatedVideos={generatedVideos}
            />
            <CharacterInteraction 
              persona={productionPlan.storyAnalysis.characterPersona} 
              characterImage={characterModelImage || `https://picsum.photos/seed/${productionPlan.characterModel.source.replace(/\s/g, '')}/512`}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;