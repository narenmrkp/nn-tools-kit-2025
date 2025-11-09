import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const fileToUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(new Uint8Array(event.target?.result as ArrayBuffer));
    };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const VideoConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isReady, setIsReady] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });
    await ffmpeg.load();
    setIsReady(true);
  };
  
  useEffect(() => {
    loadFFmpeg();
  }, []);

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setIsConverting(true);
    setError(null);
    setDownloadUrl(null);
    setProgress(0);

    const ffmpeg = ffmpegRef.current;
    const inputFileName = 'input.video';
    const outputFileName = `output.${outputFormat}`;
    
    try {
      const fileData = await fileToUint8Array(file);
      await ffmpeg.writeFile(inputFileName, fileData);
      
      await ffmpeg.exec(['-i', inputFileName, outputFileName]);
      
      const data = await ffmpeg.readFile(outputFileName);
      const mimeType = outputFormat === 'gif' ? 'image/gif' : `video/${outputFormat}`;
      const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: mimeType }));
      setDownloadUrl(url);

    } catch(err) {
      console.error(err);
      setError("Conversion failed. The file may be too large or in an unsupported format.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">Video Converter</h2>
        <p className="text-slate-400">Convert videos securely on your device</p>
      </header>
      
      <div className="max-w-lg mx-auto">
        <div 
          className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700/50 hover:border-cyan-500 transition-colors mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" accept="video/*" />
          <p>{file ? `Selected: ${file.name}` : 'Click to select a video file'}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="text-slate-300">Convert to:</label>
            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3">
                <option value="mp4">MP4</option>
                <option value="webm">WEBM</option>
                <option value="mkv">MKV</option>
                <option value="gif">GIF</option>
            </select>
        </div>
        
        {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

        <button
          onClick={handleConvert}
          disabled={!isReady || isConverting || !file}
          className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-lg py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isReady ? 'Loading Engine...' : isConverting ? `Converting... ${progress}%` : 'Convert'}
        </button>

        {isConverting && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        )}

        {downloadUrl && (
          <a href={downloadUrl} download={`converted.${outputFormat}`} className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 transition-all">
            Download Converted File
          </a>
        )}
      </div>
    </div>
  );
};