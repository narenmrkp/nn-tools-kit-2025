import React, { useState } from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';
import { TemperatureConverter } from './components/TemperatureConverter';
import { ImageToPdfConverter } from './components/ImageToPdfConverter';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { AgeCalculator } from './components/AgeCalculator';
import { BMICalculator } from './components/BMICalculator';
import { PasswordGenerator } from './components/PasswordGenerator';
import { WeightConverter } from './components/WeightConverter';
import { DistanceConverter } from './components/DistanceConverter';
import { UnitConverter } from './components/UnitConverter';
import { WorldClock } from './components/WorldClock';
import { TextToSpeech } from './components/TextToSpeech';
import { ImageRestorer } from './components/ImageRestorer';
import { AudioConverter } from './components/AudioConverter';
import { VideoConverter } from './components/VideoConverter';
import { FileCompressor } from './components/FileCompressor';
import { ImageTo3DConverter } from './components/ImageTo3DConverter';

import { 
  CurrencyExchangeIcon, 
  ThermometerIcon, 
  DocumentArrowDownIcon, 
  QrCodeIcon,
  CakeIcon,
  ScaleIcon,
  KeyIcon,
  ArrowLeftIcon,
  AudioWaveIcon,
  ArchiveBoxIcon,
  WeightIcon,
  RulerIcon,
  GlobeAltIcon,
  CalculatorIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  SparklesIcon,
  CubeIcon,
  MascotIcon
} from './components/Icons';

type Tool = 'currency' | 'temperature' | 'pdf' | 'qrcode' | 'age' | 'bmi' | 'password' | 'weight' | 'distance' | 'unit' | 'clock' | 'tts' | 'restore' | 'audio' | 'video' | 'compress' | 'image3d';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const tools = [
    { id: 'currency', name: 'Currency Converter', icon: <CurrencyExchangeIcon className="w-8 h-8" /> },
    { id: 'temperature', name: 'Temperature Converter', icon: <ThermometerIcon className="w-8 h-8" /> },
    { id: 'weight', name: 'Weight Converter', icon: <WeightIcon className="w-8 h-8" /> },
    { id: 'distance', name: 'Distance Converter', icon: <RulerIcon className="w-8 h-8" /> },
    { id: 'unit', name: 'Unit Converter', icon: <CalculatorIcon className="w-8 h-8" /> },
    { id: 'pdf', name: 'Image to PDF', icon: <DocumentArrowDownIcon className="w-8 h-8" /> },
    { id: 'qrcode', name: 'QR Code Generator', icon: <QrCodeIcon className="w-8 h-8" /> },
    { id: 'age', name: 'Age Calculator', icon: <CakeIcon className="w-8 h-8" /> },
    { id: 'bmi', name: 'BMI Calculator', icon: <ScaleIcon className="w-8 h-8" /> },
    { id: 'password', name: 'Password Generator', icon: <KeyIcon className="w-8 h-8" /> },
    { id: 'clock', name: 'World Clock', icon: <GlobeAltIcon className="w-8 h-8" /> },
    { id: 'tts', name: 'Text to Speech', icon: <SpeakerWaveIcon className="w-8 h-8" /> },
    { id: 'restore', name: 'AI Image Restore', icon: <SparklesIcon className="w-8 h-8" /> },
    { id: 'image3d', name: 'AI Image to 3D', icon: <CubeIcon className="w-8 h-8" /> },
    { id: 'audio', name: 'Audio Converter', icon: <AudioWaveIcon className="w-8 h-8" /> },
    { id: 'video', name: 'Video Converter', icon: <VideoCameraIcon className="w-8 h-8" /> },
    { id: 'compress', name: 'File Compressor', icon: <ArchiveBoxIcon className="w-8 h-8" /> },
  ];

  const renderTool = () => {
    switch (activeTool) {
      case 'currency': return <CurrencyConverter />;
      case 'temperature': return <TemperatureConverter />;
      case 'pdf': return <ImageToPdfConverter />;
      case 'qrcode': return <QRCodeGenerator />;
      case 'age': return <AgeCalculator />;
      case 'bmi': return <BMICalculator />;
      case 'password': return <PasswordGenerator />;
      case 'weight': return <WeightConverter />;
      case 'distance': return <DistanceConverter />;
      case 'unit': return <UnitConverter />;
      case 'clock': return <WorldClock />;
      case 'tts': return <TextToSpeech />;
      case 'restore': return <ImageRestorer />;
      case 'image3d': return <ImageTo3DConverter />;
      case 'audio': return <AudioConverter />;
      case 'video': return <VideoConverter />;
      case 'compress': return <FileCompressor />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-5xl">
        <header className="flex justify-between items-center mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <span className="text-white text-xl sm:text-2xl font-bold">NN</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100">NN-Tool kits</h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">Your All-in-One Digital Toolkit</p>
            </div>
          </div>
          <div className="hidden sm:block animate-float">
              <MascotIcon className="w-24 h-24 text-cyan-400" />
          </div>
        </header>
        
        {activeTool ? (
          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl shadow-orange-500/20 p-1">
             <div className="bg-gray-800 rounded-xl p-6 md:p-8 relative">
                <button 
                  onClick={() => setActiveTool(null)} 
                  className="absolute top-4 left-4 flex items-center gap-2 text-slate-300 hover:text-white transition-colors z-10"
                  aria-label="Go back to tools"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <div className="pt-8">
                  {renderTool()}
                </div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as Tool)}
                className="group p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/40 focus:outline-none focus:ring-4 focus:ring-orange-400/50"
              >
                {tool.icon}
                <span className="font-semibold text-sm md:text-base">{tool.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Tools are provided for informational purposes only.</p>
        <p>© NN 2025. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;