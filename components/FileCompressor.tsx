import React, { useState, useRef } from 'react';
import JSZip from 'jszip';

export const FileCompressor: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setDownloadUrl(null);
  };

  const handleCompress = async () => {
    if (!files || files.length === 0) {
      return;
    }
    setIsCompressing(true);
    setDownloadUrl(null);

    const zip = new JSZip();
    for (let i = 0; i < files.length; i++) {
      zip.file(files[i].name, files[i]);
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">File Compressor</h2>
        <p className="text-slate-400">Compress multiple files into a single ZIP archive</p>
      </header>
      
      <div className="max-w-lg mx-auto">
        <div 
          className="w-full border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-cyan-500 transition-colors mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          <p>Click to select one or more files</p>
        </div>

        {files && files.length > 0 && (
          <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 max-h-48 overflow-y-auto">
            <h4 className="font-semibold mb-2">Selected Files:</h4>
            <ul className="list-disc list-inside text-sm text-slate-300">
              {/* FIX: Explicitly type 'file' as 'File' to resolve TypeScript error where it was being inferred as 'unknown'. */}
              {Array.from(files).map((file: File, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={isCompressing || !files || files.length === 0}
          className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompressing ? 'Compressing...' : 'Compress Files'}
        </button>

        {downloadUrl && (
          <a href={downloadUrl} download="archive.zip" className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 transition-all">
            Download ZIP
          </a>
        )}
      </div>
    </div>
  );
};