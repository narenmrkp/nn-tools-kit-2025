import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
// FIX: Resolve module not found error by adding the icon export in Icons.tsx.
import { ArrowDownTrayIcon } from './Icons';

export const QRCodeGenerator: React.FC = () => {
    const [text, setText] = useState<string>('https://nn-daily-tools.netlify.app/');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (text.trim() === '') {
            setQrCodeUrl('');
            setError('');
            return;
        }
        QRCode.toDataURL(text, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark:"#000000FF",
                light:"#FFFFFFFF"
            }
        })
        .then(url => {
            setQrCodeUrl(url);
            setError('');
        })
        .catch(err => {
            console.error(err);
            setError('Could not generate QR code.');
            setQrCodeUrl('');
        });
    }, [text]);

    return (
        <div>
            <header className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">QR Code Generator</h2>
                <p className="text-slate-400">Create a QR code for your URL or text</p>
            </header>

            <div className="flex flex-col gap-4">
                <label htmlFor="qr-text" className="text-slate-400 text-sm font-medium">Enter Text or URL</label>
                <textarea
                    id="qr-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow resize-none"
                    placeholder="Enter text or URL here..."
                    rows={3}
                />
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-6">
                {error && <p className="text-red-400">{error}</p>}
                {qrCodeUrl && (
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                         <img src={qrCodeUrl} alt="Generated QR Code" className="w-48 h-48 md:w-56 md:h-56"/>
                    </div>
                )}
                {qrCodeUrl && (
                    <a
                        href={qrCodeUrl}
                        download="qrcode.png"
                        className="w-full max-w-xs bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
                    >
                        Download QR Code
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </a>
                )}
            </div>
        </div>
    );
};