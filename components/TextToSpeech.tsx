import React, { useState, useEffect } from 'react';

const languageCodes = {
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Urdu: 'ur-IN',
  EnglishUS: 'en-US',
  EnglishUK: 'en-GB',
  Spanish: 'es-ES',
  French: 'fr-FR',
  German: 'de-DE',
  Italian: 'it-IT',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
  Chinese: 'zh-CN',
  Russian: 'ru-RU',
  Portuguese: 'pt-BR',
  Arabic: 'ar-SA',
  Dutch: 'nl-NL',
  Swedish: 'sv-SE',
  Norwegian: 'nb-NO',
  Danish: 'da-DK',
  Finnish: 'fi-FI',
  Polish: 'pl-PL',
  Turkish: 'tr-TR',
  Indonesian: 'id-ID',
};

type Language = keyof typeof languageCodes;

export const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('Hello, world! Welcome to NN-Tool kits.');
  const [selectedLang, setSelectedLang] = useState<Language>('EnglishUS');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        const langCode = languageCodes[selectedLang];
        const defaultVoice = availableVoices.find(v => v.lang === langCode);
        setSelectedVoice(defaultVoice ? defaultVoice.voiceURI : availableVoices[0].voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedLang]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const filteredVoices = voices.filter(v => v.lang === languageCodes[selectedLang]);

  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">Text to Speech</h2>
        <p className="text-slate-400">Convert text into natural-sounding speech</p>
      </header>
      
      <div className="max-w-lg mx-auto">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
          placeholder="Enter text here..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-slate-400 text-sm font-medium">Language</label>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value as Language)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 mt-1"
            >
              {Object.keys(languageCodes).map(lang => (
                <option key={lang} value={lang}>{lang.replace(/([A-Z])/g, ' $1').trim()}</option>
              ))}
            </select>
          </div>
           <div>
            <label className="text-slate-400 text-sm font-medium">Voice</label>
            <select
              value={selectedVoice || ''}
              onChange={e => setSelectedVoice(e.target.value)}
              disabled={filteredVoices.length === 0}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 mt-1 disabled:opacity-50"
            >
              {filteredVoices.length > 0 ? (
                 filteredVoices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
                 ))
              ) : (
                <option>No voices for this language</option>
              )}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleSpeak}
          disabled={!text || voices.length === 0}
          className="w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all duration-300"
        >
          {isSpeaking ? 'Stop Speaking' : 'Speak Text'}
        </button>
      </div>
    </div>
  );
};