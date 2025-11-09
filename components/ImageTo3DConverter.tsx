import React, { useState, useRef } from 'react';
import { convertTo3D } from '../services/geminiService';
import { ArrowDownTrayIcon, CubeIcon } from './Icons';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const ImageTo3DConverter: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('A cute, fluffy teddy bear in a playful pose.');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      setConvertedImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setConvertedImage(null);

    try {
      const base64Data = await blobToBase64(file);
      const convertedBase64 = await convertTo3D(base64Data, file.type, prompt);
      setConvertedImage(`data:image/png;base64,${convertedBase64}`);
    } catch (err) {
      setError('Failed to convert image. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">AI Image to 3D Converter</h2>
        <p className="text-slate-400">Turn your photos into 3D-style art with Gemini</p>
      </header>

      {!originalImage && (
        <div 
          className="w-full h-64 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-cyan-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <p>Click to browse or drag & drop an image to convert</p>
          <p className="text-sm text-slate-500 mt-1">PNG, JPG, WEBP supported</p>
        </div>
      )}

      {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
      
      {originalImage && (
        <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center">
                <h3 className="font-semibold mb-2">Original 2D</h3>
                <img src={originalImage} alt="Original" className="max-h-80 w-auto object-contain rounded-lg mx-auto" />
            </div>
             <div className="text-center">
                <h3 className="font-semibold mb-2">Converted 3D</h3>
                <div className="h-80 w-full bg-slate-900/50 rounded-lg flex items-center justify-center">
                   {isLoading && <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>}
                    {convertedImage && <img src={convertedImage} alt="Converted" className="max-h-80 w-auto object-contain rounded-lg mx-auto" />}
                    {!isLoading && !convertedImage && <p className="text-slate-400">Ready to convert</p>}
                </div>
            </div>
         </div>
         <div className="mt-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-400 mb-2">Describe the 3D style you want (optional):</label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder="e.g., 'A claymation style character', 'Pixar movie style', 'A low-poly video game asset'"
                rows={2}
            />
         </div>
        </>
      )}


      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto bg-slate-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-600 transition-colors"
        >
          {originalImage ? 'Change Image' : 'Select Image'}
        </button>
        <button
          onClick={handleConvert}
          disabled={isLoading || !originalImage}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <CubeIcon className="w-5 h-5" />
          {isLoading ? 'Converting...' : 'Convert to 3D'}
        </button>
        {convertedImage && (
            <a href={convertedImage} download="3d_image.png" className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 transition-all">
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download
            </a>
        )}
      </div>
    </div>
  );
};