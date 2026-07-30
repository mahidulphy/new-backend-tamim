import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image, Film, Mic, FileWarning, Loader2 } from 'lucide-react';
import { api } from '../../api';

interface UploadingFile {
  id: string;
  file: File;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'VOICE_NOTE';
  progress: number;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

interface MediaUploaderProps {
  onUploadComplete?: () => void;
  accept?: string;
  multiple?: boolean;
  mediaType?: 'IMAGE' | 'VIDEO' | 'VOICE_NOTE';
}

function fileToType(file: File): 'IMAGE' | 'VIDEO' | 'VOICE_NOTE' {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type.startsWith('video/')) return 'VIDEO';
  return 'VOICE_NOTE';
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  multiple = true,
  mediaType,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      files.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allowedTypes = mediaType
    ? mediaType === 'IMAGE'
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
      : mediaType === 'VIDEO'
      ? ['video/mp4', 'video/webm', 'video/quicktime']
      : ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
    : undefined;

  const allowedAccept = mediaType
    ? mediaType === 'IMAGE'
      ? 'image/*'
      : mediaType === 'VIDEO'
      ? 'video/*'
      : 'audio/*'
    : undefined;

  const processFiles = (fileList: FileList | File[]) => {
    const newFiles: UploadingFile[] = Array.from(fileList)
      .filter(f => !allowedTypes || allowedTypes.includes(f.type))
      .map(file => ({
        id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        type: fileToType(file),
        progress: 0,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: 'pending' as const,
      }));
    if (newFiles.length === 0) return;
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    newFiles.forEach(uploadFile);
  };

  const uploadFile = async (uf: UploadingFile) => {
    setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, status: 'uploading' } : f));
    try {
      await api.upload.file(uf.file, uf.name);
      setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, status: 'done', progress: 100 } : f));
      onUploadComplete?.();
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === uf.id ? { ...f, status: 'error', error: err.message } : f));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const f = prev.find(x => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter(x => x.id !== id);
    });
  };

  const totalUploading = files.filter(f => f.status === 'uploading' || f.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-rose-500 bg-rose-500/5'
            : 'border-neutral-700 bg-neutral-950 hover:border-neutral-600'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={allowedAccept}
          onChange={handleInputChange}
        />
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-neutral-400" />
        </div>
        <p className="text-sm font-semibold text-white mb-1">
          {dragOver ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p className="text-xs text-neutral-500">
          {mediaType
            ? `${mediaType === 'IMAGE' ? 'Images' : mediaType === 'VIDEO' ? 'Videos' : 'Audio files'} up to 50 MB`
            : 'Images, videos, and audio up to 50 MB'}
        </p>
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              {/* Preview Icon */}
              <div className="w-10 h-10 rounded-lg bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden">
                {f.preview ? (
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                ) : f.type === 'VIDEO' ? (
                  <Film className="w-5 h-5 text-amber-400" />
                ) : (
                  <Mic className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{f.name}</p>
                <p className="text-[10px] text-neutral-500 font-mono">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                {f.status === 'uploading' && (
                  <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
                {f.status === 'error' && <p className="text-[10px] text-rose-400 mt-0.5">{f.error || 'Upload failed'}</p>}
              </div>

              {/* Status */}
              <div className="shrink-0">
                {f.status === 'pending' && <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />}
                {f.status === 'uploading' && <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />}
                {f.status === 'done' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                {f.status === 'error' && <FileWarning className="w-4 h-4 text-rose-400" />}
                {f.status === 'done' && (
                  <button onClick={() => removeFile(f.id)} className="ml-2 p-0.5 hover:opacity-70">
                    <X className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload all button for pending */}
      {totalUploading > 0 && (
        <p className="text-[10px] text-neutral-400 text-center">
          {totalUploading} file{totalUploading > 1 ? 's' : ''} uploading...
        </p>
      )}
    </div>
  );
};
