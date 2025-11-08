
import React from 'react';
import type { Language } from '../types';
import { Language as LanguageEnum } from '../types';
import { PhotoIcon, XMarkIcon } from './icons/Icons';

interface InputFormProps {
    drawingDesc: string;
    setDrawingDesc: (value: string) => void;
    parentPrompt: string;
    setParentPrompt: (value: string) => void;
    language: Language;
    setLanguage: (value: Language) => void;
    onGenerate: () => void;
    isLoading: boolean;
    hasVeoApiKey: boolean;
    characterImage: string | null;
    setCharacterImage: (value: string | null) => void;
    setCharacterImageMimeType: (value: string | null) => void;
}

const InputForm: React.FC<InputFormProps> = ({
    drawingDesc,
    setDrawingDesc,
    parentPrompt,
    setParentPrompt,
    language,
    setLanguage,
    onGenerate,
    isLoading,
    hasVeoApiKey,
    characterImage,
    setCharacterImage,
    setCharacterImageMimeType
}) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const mimeType = result.match(/:(.*?);/)?.[1];
                if (mimeType) {
                    setCharacterImage(result);
                    setCharacterImageMimeType(mimeType);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCharacterImage(null);
        setCharacterImageMimeType(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                    Your Character
                </label>
                <div className="mt-2 bg-gray-900 border border-gray-600 rounded-lg p-4 space-y-4">
                    {characterImage ? (
                        <div className="relative group">
                            <img src={characterImage} alt="Character preview" className="rounded-lg w-full max-h-60 object-contain" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                aria-label="Remove image"
                            >
                                <XMarkIcon />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="relative block w-full border-2 border-gray-500 border-dashed rounded-lg p-8 text-center hover:border-purple-400 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <PhotoIcon />
                                <span className="mt-2 block text-sm font-semibold text-gray-400">
                                    Upload a drawing
                                </span>
                            </div>
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleFileChange}
                                aria-label="Upload character drawing"
                            />
                        </div>
                    )}
                    
                    <div>
                         <label htmlFor="drawing-desc" className="sr-only">
                            Add more details about your character...
                        </label>
                        <textarea
                            id="drawing-desc"
                            rows={2}
                            className="w-full bg-gray-800 border-0 rounded-md p-2 focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500 text-sm"
                            placeholder="Add more details about your character (optional)..."
                            value={drawingDesc}
                            onChange={(e) => setDrawingDesc(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="parent-prompt" className="block text-sm font-medium text-purple-300 mb-2">
                    Parent's Lesson or Theme
                </label>
                <input
                    type="text"
                    id="parent-prompt"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-gray-500"
                    placeholder="e.g., It's important to clean up your toys."
                    value={parentPrompt}
                    onChange={(e) => setParentPrompt(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="language" className="block text-sm font-medium text-purple-300 mb-2">
                    Language
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                    <option value={LanguageEnum.ENGLISH}>English</option>
                    <option value={LanguageEnum.HINDI}>Hindi</option>
                </select>
            </div>
            
            <div className="text-center pt-4">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !hasVeoApiKey}
                    className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-purple-500/30"
                >
                    {isLoading ? 'Creating Magic...' : 'Generate Story'}
                </button>
                 {!hasVeoApiKey && <p className="text-sm text-yellow-400 mt-3">Please select a Veo API key below to enable generation.</p>}
            </div>
        </div>
    );
};

export default InputForm;
