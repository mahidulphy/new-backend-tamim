import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Printer, Copy, ExternalLink, Sparkles, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QRShareModalProps {
  qrValue: string;
  recipientName: string;
  memoryTitle: string;
  isOpen: boolean;
  onClose: () => void;
  foregroundColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
  qrId?: string;
}

export const QRShareModal: React.FC<QRShareModalProps> = ({
  qrValue,
  recipientName,
  memoryTitle,
  isOpen,
  onClose,
  foregroundColor = '#000000',
  backgroundColor = '#FFFFFF',
  logoUrl,
  qrId,
}) => {
  const { addToast } = useApp();
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const fullUrl = qrValue.startsWith('http') ? qrValue : `${window.location.origin}/#${qrValue}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    addToast('Link Copied', 'Memory URL copied to clipboard!', 'success');
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${recipientName.replace(/[^a-zA-Z0-9]/g, '_')}_Memory.png`;
    a.click();
    addToast('Downloaded PNG', 'QR Code image saved.', 'success');
  };

  const downloadSVG = () => {
    if (!qrId) { addToast('Error', 'QR ID required for SVG download.', 'error'); return; }
    const url = `/api/qr/${qrId}/download?format=svg&width=400`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${recipientName.replace(/[^a-zA-Z0-9]/g, '_')}_Memory.svg`;
    a.click();
    addToast('Downloaded SVG', 'Vector QR Code saved.', 'success');
  };

  const printQR = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Official Gift QR Code
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-1">{recipientName}</h3>
        <p className="text-xs text-neutral-400 mb-6 truncate">{memoryTitle}</p>

        <div ref={canvasRef} className="p-6 rounded-2xl inline-block border border-neutral-200 shadow-xl mb-6" style={{ backgroundColor }}>
          {logoUrl && (
            <div className="relative mb-2">
              <img src={logoUrl} alt="Brand logo" className="h-8 mx-auto object-contain" />
            </div>
          )}
          <QRCodeCanvas
            value={fullUrl}
            size={200}
            level="H"
            marginSize={2}
            fgColor={foregroundColor}
            bgColor={backgroundColor}
          />
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-6 font-mono">
          <span className="truncate flex-1 text-left px-2">{fullUrl}</span>
          <button
            onClick={copyToClipboard}
            aria-label="Copy URL"
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white shrink-0 transition-colors"
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={downloadPNG}
            aria-label="Download PNG"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all shadow-lg shadow-rose-950/40"
          >
            <Download className="w-4 h-4" /> PNG
          </button>
          {qrId && (
            <button
              onClick={downloadSVG}
              aria-label="Download SVG"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all shadow-lg shadow-purple-950/40"
            >
              <Image className="w-4 h-4" /> SVG
            </button>
          )}
          <button
            onClick={printQR}
            aria-label="Print QR code"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Test link"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Test
          </a>
        </div>
      </div>
    </div>
  );
};
