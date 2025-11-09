import React, { useState, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { ArrowRightIcon } from './Icons';

export const ImageToPdfConverter: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        setSelectedImage(null);
        setFileName('');
        return;
      }
      setError(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = useCallback(() => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }
    setIsConverting(true);
    setError(null);

    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      try {
        const doc = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height],
        });
        doc.addImage(selectedImage, 'auto', 0, 0, img.width, img.height);
        const pdfName = fileName.substring(0, fileName.lastIndexOf('.')) || 'converted';
        doc.save(`${pdfName}.pdf`);
      } catch (e) {
        console.error("PDF generation failed:", e);
        setError("Could not generate PDF. The image might be corrupted or in an unsupported format.");
      } finally {
        setIsConverting(false);
      }
    };
    img.onerror = () => {
      setError("Could not load the image for conversion.");
      setIsConverting(false);
    }
  }, [selectedImage, fileName]);

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">Image to PDF Converter</h2>
          <p className="text-slate-400">Convert JPG, PNG, and other images to PDF</p>
        </div>
      </header>
      
      <div 
        className="w-full h-48 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-cyan-500 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden"
          accept="image/*" 
        />
        {selectedImage ? (
          <img src={selectedImage} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center">
            <p>Click to browse or drag & drop an image</p>
            <p className="text-sm text-slate-500 mt-1">PNG, JPG, GIF, WEBP supported</p>
          </div>
        )}
      </div>

      {fileName && <p className="text-center text-sm text-slate-400 mt-2">Selected: {fileName}</p>}

      {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

      <button
        onClick={handleConvert}
        disabled={isConverting || !selectedImage}
        className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
      >
        {isConverting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Converting...
          </>
        ) : (
          <>
            Convert & Download PDF <ArrowRightIcon className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};
