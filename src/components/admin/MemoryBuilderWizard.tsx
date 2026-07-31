import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Mic, FileText, Music, QrCode, Eye, Plus, Trash2, Image, Film, Upload, Loader2, GripVertical, ArrowUp, ArrowDown, X, Globe, Lock, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Memory, Photo, Video, VoiceNote, TimelineEvent, MediaItem } from '../../types';
import { TemplateRenderer } from '../public-memory/TemplateRenderer';
import { QRShareModal } from '../shared/QRShareModal';
import { MediaPickerModal } from './MediaPickerModal';
import { api } from '../../api';

export const MemoryBuilderWizard: React.FC<{ initialMemoryId?: string }> = ({ initialMemoryId }) => {
  const { templates, music, saveMemory, memories, addToast, navigateTo, generateOrUpdateQR } = useApp();

  const existingMemory = initialMemoryId ? memories.find(m => m.id === initialMemoryId) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Memory>>(() => {
    if (existingMemory) return { ...existingMemory };
    return {
      title: '',
      subtitle: '',
      recipientName: '',
      senderName: '',
      relationship: '',
      coverImage: '',
      templateId: 'tmpl_rose_garden',
      musicId: undefined,
      status: 'DRAFT',
      visibility: 'PUBLIC',
      accessPassword: '',
      letter: {
        id: `ltr_${Date.now()}`,
        memoryId: '',
        title: '',
        content: '',
        fontStyle: 'serif',
        textAlignment: 'left'
      },
      photos: [],
      videos: [],
      voiceNotes: [],
      timeline: []
    };
  });

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [createdMemory, setCreatedMemory] = useState<Memory | null>(null);
  const [mediaPickerType, setMediaPickerType] = useState<'IMAGE' | 'VIDEO' | 'VOICE_NOTE' | null>(null);

  const [uploadingPhotos, setUploadingPhotos] = useState<{ id: string; name: string; progress: number; status: 'uploading' | 'done' | 'error'; error?: string }[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [uploadingCover, setUploadingCover] = useState<{ id: string; name: string; progress: number; status: 'uploading' | 'done' | 'error'; error?: string } | null>(null);
  const coverUploadInputRef = useRef<HTMLInputElement>(null);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  const [uploadingVideos, setUploadingVideos] = useState<{ id: string; name: string; progress: number; status: 'uploading' | 'done' | 'error'; error?: string }[]>([]);
  const videoUploadInputRef = useRef<HTMLInputElement>(null);

  const [uploadingVoiceNotes, setUploadingVoiceNotes] = useState<{ id: string; name: string; progress: number; status: 'uploading' | 'done' | 'error'; error?: string }[]>([]);
  const audioUploadInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedFile, setRecordedFile] = useState<File | null>(null);
  const [uploadingRecorded, setUploadingRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [recordedName, setRecordedName] = useState('');

  const handleUploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    uploadInputRef.current!.value = '';

    const uploadEntries = imageFiles.map(f => ({
      id: `up_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadingPhotos(prev => [...prev, ...uploadEntries]);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const entry = uploadEntries[i];
      try {
        const mediaItem = await api.upload.fileWithProgress(file, (pct) => {
          setUploadingPhotos(prev => prev.map(e => e.id === entry.id ? { ...e, progress: pct } : e));
        });
        setUploadingPhotos(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'done', progress: 100 } : e));
        const newPhoto: Photo = {
          id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          memoryId: formData.id || '',
          imageUrl: mediaItem.url,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          displayOrder: (formData.photos?.length || 0) + 1 + i,
        };
        setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }));
      } catch (err: any) {
        setUploadingPhotos(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'error', error: err.message } : e));
      }
    }
  };

  const handleUploadCover = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    coverUploadInputRef.current!.value = '';

    const entryId = `uc_${Date.now()}`;
    setUploadingCover({ id: entryId, name: file.name, progress: 0, status: 'uploading' });

    try {
      const mediaItem = await api.upload.fileWithProgress(file, (pct) => {
        setUploadingCover(prev => prev && prev.id === entryId ? { ...prev, progress: pct } : prev);
      });
      setUploadingCover({ id: entryId, name: file.name, progress: 100, status: 'done' });
      setFormData(prev => ({ ...prev, coverImage: mediaItem.url }));
    } catch (err: any) {
      setUploadingCover({ id: entryId, name: file.name, progress: 0, status: 'error', error: err.message });
    }
  };

  const handleUploadVideos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    if (videoFiles.length === 0) return;

    videoUploadInputRef.current!.value = '';

    const uploadEntries = videoFiles.map(f => ({
      id: `uv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadingVideos(prev => [...prev, ...uploadEntries]);

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      const entry = uploadEntries[i];
      try {
        const mediaItem = await api.upload.fileWithProgress(file, (pct) => {
          setUploadingVideos(prev => prev.map(e => e.id === entry.id ? { ...e, progress: pct } : e));
        });
        setUploadingVideos(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'done', progress: 100 } : e));
        const newVideo: Video = {
          id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          memoryId: formData.id || '',
          videoUrl: mediaItem.url,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          displayOrder: (formData.videos?.length || 0) + 1 + i,
        };
        setFormData(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
      } catch (err: any) {
        setUploadingVideos(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'error', error: err.message } : e));
      }
    }
  };

  const handleUploadVoiceNotes = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const audioFiles = Array.from(files).filter(f => f.type.startsWith('audio/'));
    if (audioFiles.length === 0) return;

    audioUploadInputRef.current!.value = '';

    const uploadEntries = audioFiles.map(f => ({
      id: `ua_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadingVoiceNotes(prev => [...prev, ...uploadEntries]);

    for (let i = 0; i < audioFiles.length; i++) {
      const file = audioFiles[i];
      const entry = uploadEntries[i];
      try {
        const mediaItem = await api.upload.fileWithProgress(file, (pct) => {
          setUploadingVoiceNotes(prev => prev.map(e => e.id === entry.id ? { ...e, progress: pct } : e));
        });
        setUploadingVoiceNotes(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'done', progress: 100 } : e));
        const newNote: VoiceNote = {
          id: `vn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          memoryId: formData.id || '',
          title: file.name.replace(/\.[^/.]+$/, ''),
          audioUrl: mediaItem.url,
          duration: '00:30',
          displayOrder: (formData.voiceNotes?.length || 0) + 1 + i,
        };
        setFormData(prev => ({ ...prev, voiceNotes: [...(prev.voiceNotes || []), newNote] }));
      } catch (err: any) {
        setUploadingVoiceNotes(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'error', error: err.message } : e));
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
        setRecordedBlobUrl(url);
        setRecordedFile(file);
        setRecordedName(file.name);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTimer(0);
      timerRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } catch {
      addToast('error', 'Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const addRecordedVoiceNote = async () => {
    if (!recordedFile) return;
    setUploadingRecorded(true);
    try {
      const mediaItem = await api.upload.fileWithProgress(recordedFile, () => {});
      const newNote: VoiceNote = {
        id: `vn_${Date.now()}`,
        memoryId: formData.id || '',
        title: recordedName.replace(/\.[^/.]+$/, '') || 'Voice Recording',
        audioUrl: mediaItem.url,
        duration: `${Math.floor(recordingTimer / 60)}:${String(recordingTimer % 60).padStart(2, '0')}`,
        displayOrder: (formData.voiceNotes?.length || 0) + 1,
      };
      setFormData(prev => ({ ...prev, voiceNotes: [...(prev.voiceNotes || []), newNote] }));
      setRecordedBlobUrl(null);
      setRecordedFile(null);
      setRecordedName('');
      setRecordingTimer(0);
    } catch (err: any) {
      addToast('error', 'Failed to upload recording: ' + err.message);
    } finally {
      setUploadingRecorded(false);
    }
  };

  const discardRecording = () => {
    if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
    setRecordedBlobUrl(null);
    setRecordedFile(null);
    setRecordedName('');
    setRecordingTimer(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
    };
  }, []);

  const movePhoto = (index: number, direction: -1 | 1) => {
    const photos = [...(formData.photos || [])];
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    [photos[index], photos[target]] = [photos[target], photos[index]];
    photos.forEach((p, i) => { p.displayOrder = i + 1; });
    setFormData({ ...formData, photos });
  };

  const replacePhoto = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const replaceId = `rp_${Date.now()}`;
      setUploadingPhotos(prev => [...prev, { id: replaceId, name: file.name, progress: 0, status: 'uploading' }]);
      try {
        const mediaItem = await api.upload.fileWithProgress(file, (pct) => {
          setUploadingPhotos(prev => prev.map(e => e.id === replaceId ? { ...e, progress: pct } : e));
        });
        setUploadingPhotos(prev => prev.map(e => e.id === replaceId ? { ...e, status: 'done', progress: 100 } : e));
        const updated = [...(formData.photos || [])];
        updated[index] = { ...updated[index], imageUrl: mediaItem.url };
        setFormData({ ...formData, photos: updated });
      } catch (err: any) {
        setUploadingPhotos(prev => prev.map(e => e.id === replaceId ? { ...e, status: 'error', error: err.message } : e));
      }
    };
    input.click();
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    const updated = [...(formData.photos || [])];
    updated[index] = { ...updated[index], caption };
    setFormData({ ...formData, photos: updated });
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: (formData.photos || []).filter((_, i) => i !== index),
    });
  };

  const steps = [
    'Template', 'Basic Info', 'Cover', 'Photos', 'Videos', 
    'Voice Notes', 'Letter', 'Timeline', 'Music', 'Preview', 'Publish & QR'
  ];

  const handleNext = () => {
    if (currentStep === 2 && (!formData.recipientName || !formData.senderName || !formData.title)) {
      addToast('Validation Error', 'Please enter recipient name, sender name, and memory title.', 'warning');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 11));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    if (!formData.recipientName || !formData.senderName || !formData.title || !formData.templateId) {
      addToast('Validation Error', 'Please fill in Recipient Name, Sender Name, Memory Title, and select a Template before saving.', 'warning');
      return;
    }
    if (formData.visibility === 'PASSWORD_PROTECTED' && (!formData.accessPassword || formData.accessPassword.length < 4)) {
      addToast('Validation Error', 'Password-protected memories need a password of at least 4 characters.', 'warning');
      return;
    }
    const saved = await saveMemory({ ...formData, status: 'DRAFT' });
    setCreatedMemory(saved);
    if (!initialMemoryId) {
      generateOrUpdateQR(saved.id, saved.slug, saved.title);
    }
  };

  const handlePublish = async () => {
    if (!formData.recipientName || !formData.senderName || !formData.title || !formData.templateId) {
      addToast('Validation Error', 'Please fill in Recipient Name, Sender Name, Memory Title, and select a Template before publishing.', 'warning');
      return;
    }
    if (formData.visibility === 'PASSWORD_PROTECTED' && (!formData.accessPassword || formData.accessPassword.length < 4)) {
      addToast('Validation Error', 'Password-protected memories need a password of at least 4 characters.', 'warning');
      return;
    }
    const published = await saveMemory({ ...formData, status: 'PUBLISHED' });
    setCreatedMemory(published);
    generateOrUpdateQR(published.id, published.slug, published.title);
    setQrModalOpen(true);
  };

  // Add new video helper
  const addVideo = () => {
    const newVideo: Video = {
      id: `v_${Date.now()}`,
      memoryId: formData.id || '',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: 'New Video Memory',
      displayOrder: (formData.videos?.length || 0) + 1
    };
    setFormData(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
  };

  // Add new voice note helper
  const addVoiceNote = () => {
    const newNote: VoiceNote = {
      id: `vn_${Date.now()}`,
      memoryId: formData.id || '',
      title: 'New Voice Recording',
      audioUrl: 'https://res.cloudinary.com/vrniaume/video/upload/v1785510560/memorygift/voice_notes/tmkc-mahavirwa-wala-mp3-old-raw-.mp3',
      duration: '00:06',
      displayOrder: (formData.voiceNotes?.length || 0) + 1
    };
    setFormData(prev => ({ ...prev, voiceNotes: [...(prev.voiceNotes || []), newNote] }));
  };

  // Add new timeline helper
  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: `t_${Date.now()}`,
      memoryId: formData.id || '',
      title: 'New Milestone',
      description: 'Describe this special moment...',
      eventDate: 'Today',
      displayOrder: (formData.timeline?.length || 0) + 1
    };
    setFormData(prev => ({ ...prev, timeline: [...(prev.timeline || []), newEvent] }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Steps Progress */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Memory Creation Wizard</h1>
          <p className="text-xs text-neutral-400">Step {currentStep} of 11: {steps[currentStep - 1]}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800 mb-4">
          <div 
            className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 11) * 100}%` }}
          />
        </div>

        {/* Step Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar text-[10px] font-mono">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx + 1)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                currentStep === idx + 1
                  ? 'bg-rose-600 text-white font-bold'
                  : currentStep > idx + 1
                  ? 'bg-neutral-800 text-rose-400'
                  : 'bg-neutral-950 text-neutral-500'
              }`}
            >
              {idx + 1}. {st}
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT SWITCH */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* STEP 1: SELECT TEMPLATE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-2">1. Select Memory Template</h2>
            <p className="text-xs text-neutral-400 mb-6">Choose the visual aesthetic for your recipient.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => setFormData({ ...formData, templateId: tmpl.id })}
                  className={`p-4 rounded-2xl bg-neutral-950 border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.templateId === tmpl.id
                      ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-xl'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <img src={tmpl.thumbnail} alt={tmpl.name} className="w-full h-40 object-cover rounded-xl mb-4" />
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                      {formData.templateId === tmpl.id && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mb-4">{tmpl.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase">{tmpl.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">2. Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName || ''}
                  onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Sophia Lin"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Sender Name *</label>
                <input
                  type="text"
                  required
                  value={formData.senderName || ''}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="Marcus Bennett"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Relationship</label>
              <input
                type="text"
                value={formData.relationship || ''}
                onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                placeholder="Fiancée, Best Friend, Spouse..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Memory Headline *</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Will You Marry Me, Sophia?"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Subtitle / Short Description</label>
              <textarea
                rows={2}
                value={formData.subtitle || ''}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="A journey through our 5 unforgettable years of love..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-4 border-t border-neutral-800 mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-3">Who Can View This Memory?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.visibility === 'PUBLIC'
                        ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Globe className={`w-4 h-4 ${formData.visibility === 'PUBLIC' ? 'text-rose-400' : 'text-neutral-500'}`} />
                      <span className="text-sm font-bold text-white">Public</span>
                      {formData.visibility === 'PUBLIC' && <CheckCircle2 className="w-4 h-4 text-rose-400 ml-auto" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">Anyone with the link or QR code can view.</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, visibility: 'PASSWORD_PROTECTED' })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.visibility === 'PASSWORD_PROTECTED'
                        ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lock className={`w-4 h-4 ${formData.visibility === 'PASSWORD_PROTECTED' ? 'text-rose-400' : 'text-neutral-500'}`} />
                      <span className="text-sm font-bold text-white">Password Protected</span>
                      {formData.visibility === 'PASSWORD_PROTECTED' && <CheckCircle2 className="w-4 h-4 text-rose-400 ml-auto" />}
                    </div>
                    <p className="text-[11px] text-neutral-400">Viewers must enter a password after scanning the QR code.</p>
                  </div>
                </div>
              </div>

              {formData.visibility === 'PASSWORD_PROTECTED' && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/25 space-y-2">
                  <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Memory Access Password *
                  </label>
                  <input
                    type="text"
                    value={formData.accessPassword || ''}
                    onChange={e => setFormData({ ...formData, accessPassword: e.target.value })}
                    placeholder="e.g. 1234 or Sophia123"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Share this password with your loved one — they will need it to open the gift after scanning the QR code.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: COVER */}
        {currentStep === 3 && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">3. Hero Cover Media</h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCoverPickerOpen(true)}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Image className="w-4 h-4" /> Browse Library
              </button>
              <button
                onClick={() => coverUploadInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" /> Upload Cover
              </button>
              {formData.coverImage && (
                <button
                  onClick={() => setFormData({ ...formData, coverImage: '' })}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-red-600/30 text-neutral-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              )}
            </div>

            <input
              ref={coverUploadInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={e => handleUploadCover(e.target.files)}
            />

            {uploadingCover && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                {uploadingCover.status === 'uploading' && <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />}
                {uploadingCover.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {uploadingCover.status === 'error' && <X className="w-4 h-4 text-red-400" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-300 truncate">{uploadingCover.name}</p>
                  {uploadingCover.status === 'uploading' && (
                    <div className="mt-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${uploadingCover.progress}%` }} />
                    </div>
                  )}
                  {uploadingCover.status === 'error' && <p className="text-xs text-red-400">{uploadingCover.error}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Or Enter Cover Image URL</label>
              <input
                type="text"
                value={formData.coverImage || ''}
                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-xs text-neutral-400 mb-2">Cover Preview:</p>
                <div className="relative group">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-56 object-cover rounded-2xl border border-neutral-800" />
                  <button
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: GALLERY */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold text-white">4. Photo Gallery</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMediaPickerType('IMAGE')}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Image className="w-4 h-4" /> Browse Library
                </button>
                <button
                  onClick={() => uploadInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Upload Photos
                </button>
              </div>
            </div>

            <input
              ref={uploadInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={e => handleUploadPhotos(e.target.files)}
            />

            {/* Upload progress */}
            {uploadingPhotos.length > 0 && (
              <div className="space-y-2">
                {uploadingPhotos.map(up => (
                  <div key={up.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    {up.status === 'uploading' ? (
                      <Loader2 className="w-5 h-5 text-rose-400 animate-spin shrink-0" />
                    ) : up.status === 'done' ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{up.name}</p>
                      {up.status === 'uploading' && (
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${up.progress}%` }} />
                        </div>
                      )}
                      {up.status === 'error' && <p className="text-[10px] text-rose-400 mt-0.5">{up.error}</p>}
                    </div>
                    {up.status === 'uploading' && (
                      <span className="text-[10px] font-mono text-neutral-500">{up.progress}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {(formData.photos || []).length === 0 && uploadingPhotos.filter(u => u.status !== 'done').length === 0 && (
              <div className="text-center py-16 px-6 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <Image className="w-7 h-7 text-neutral-500" />
                </div>
                <p className="text-base font-bold text-white mb-1">No photos uploaded yet</p>
                <p className="text-xs text-neutral-400 mb-6">Upload photos or choose from your Media Library.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Upload Photos
                  </button>
                  <button
                    onClick={() => setMediaPickerType('IMAGE')}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Image className="w-4 h-4" /> Browse Library
                  </button>
                </div>
              </div>
            )}

            {/* Photo cards */}
            {(formData.photos || []).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.photos || []).map((photo, index) => (
                  <div
                    key={photo.id}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Photo #{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="text-rose-400 hover:text-rose-300 text-xs p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative group">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || 'Photo'}
                        className="w-full h-44 object-cover rounded-xl bg-neutral-900"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        onClick={() => replacePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Replace image"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Caption */}
                    <input
                      type="text"
                      value={photo.caption || ''}
                      onChange={e => updatePhotoCaption(index, e.target.value)}
                      placeholder="Add a caption..."
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-600"
                    />

                    {/* Reorder */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => movePhoto(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-400"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => movePhoto(index, 1)}
                        disabled={index === (formData.photos?.length || 0) - 1}
                        className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-400"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-neutral-500 ml-auto">Order: {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: VIDEOS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold text-white">5. Video Memories</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMediaPickerType('VIDEO')}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Film className="w-4 h-4" /> Browse Library
                </button>
                <button
                  onClick={() => videoUploadInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Upload Videos
                </button>
                <button
                  onClick={addVideo}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add URL
                </button>
              </div>
            </div>

            <input
              ref={videoUploadInputRef}
              type="file"
              multiple
              accept="video/*"
              hidden
              onChange={e => handleUploadVideos(e.target.files)}
            />

            {/* Upload progress */}
            {uploadingVideos.length > 0 && (
              <div className="space-y-2">
                {uploadingVideos.map(up => (
                  <div key={up.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    {up.status === 'uploading' ? (
                      <Loader2 className="w-5 h-5 text-rose-400 animate-spin shrink-0" />
                    ) : up.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{up.name}</p>
                      {up.status === 'uploading' && (
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${up.progress}%` }} />
                        </div>
                      )}
                      {up.status === 'error' && <p className="text-[10px] text-rose-400 mt-0.5">{up.error}</p>}
                    </div>
                    {up.status === 'uploading' && (
                      <span className="text-[10px] font-mono text-neutral-500">{up.progress}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {(formData.videos || []).length === 0 && uploadingVideos.filter(u => u.status !== 'done').length === 0 && (
              <div className="text-center py-16 px-6 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <Film className="w-7 h-7 text-neutral-500" />
                </div>
                <p className="text-base font-bold text-white mb-1">No videos uploaded yet</p>
                <p className="text-xs text-neutral-400 mb-6">Upload videos or add from URL.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => videoUploadInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Upload Videos
                  </button>
                  <button
                    onClick={() => setMediaPickerType('VIDEO')}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Film className="w-4 h-4" /> Browse Library
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.videos || []).map((video, index) => (
                <div key={video.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Video #{index + 1}</span>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          videos: (formData.videos || []).filter(v => v.id !== video.id)
                        });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={video.videoUrl}
                    onChange={e => {
                      const updated = [...(formData.videos || [])];
                      updated[index].videoUrl = e.target.value;
                      setFormData({ ...formData, videos: updated });
                    }}
                    placeholder="Video URL"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />

                  <input
                    type="text"
                    value={video.caption || ''}
                    onChange={e => {
                      const updated = [...(formData.videos || [])];
                      updated[index].caption = e.target.value;
                      setFormData({ ...formData, videos: updated });
                    }}
                    placeholder="Caption"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: VOICE NOTES */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold text-white">6. Voice Notes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMediaPickerType('VOICE_NOTE')}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Mic className="w-4 h-4" /> Browse Library
                </button>
                <button
                  onClick={() => audioUploadInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Upload Audio
                </button>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${isRecording ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'}`}
                >
                  <Mic className="w-4 h-4" /> {isRecording ? `Recording ${Math.floor(recordingTimer / 60)}:${String(recordingTimer % 60).padStart(2, '0')}` : 'Record Voice'}
                </button>
                <button
                  onClick={addVoiceNote}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add URL
                </button>
              </div>
            </div>

            <input
              ref={audioUploadInputRef}
              type="file"
              multiple
              accept="audio/*"
              hidden
              onChange={e => handleUploadVoiceNotes(e.target.files)}
            />

            {/* Upload progress */}
            {uploadingVoiceNotes.length > 0 && (
              <div className="space-y-2">
                {uploadingVoiceNotes.map(up => (
                  <div key={up.id} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                    {up.status === 'uploading' ? (
                      <Loader2 className="w-5 h-5 text-rose-400 animate-spin shrink-0" />
                    ) : up.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{up.name}</p>
                      {up.status === 'uploading' && (
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${up.progress}%` }} />
                        </div>
                      )}
                      {up.status === 'error' && <p className="text-[10px] text-rose-400 mt-0.5">{up.error}</p>}
                    </div>
                    {up.status === 'uploading' && (
                      <span className="text-[10px] font-mono text-neutral-500">{up.progress}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recorded preview */}
            {recordedBlobUrl && (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-rose-500/30 space-y-3">
                <p className="text-xs font-bold text-rose-400">Recording Preview</p>
                <audio src={recordedBlobUrl} controls className="w-full h-10" />
                <input
                  type="text"
                  value={recordedName}
                  onChange={e => setRecordedName(e.target.value)}
                  placeholder="Recording name"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={addRecordedVoiceNote}
                    disabled={uploadingRecorded}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    {uploadingRecorded ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {uploadingRecorded ? 'Uploading...' : 'Add to Memory'}
                  </button>
                  <button
                    onClick={discardRecording}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {(formData.voiceNotes || []).length === 0 && uploadingVoiceNotes.filter(u => u.status !== 'done').length === 0 && !recordedBlobUrl && (
              <div className="text-center py-16 px-6 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-7 h-7 text-neutral-500" />
                </div>
                <p className="text-base font-bold text-white mb-1">No voice notes yet</p>
                <p className="text-xs text-neutral-400 mb-6">Record a voice message, upload audio, or add from URL.</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={startRecording}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Mic className="w-4 h-4" /> Record Voice
                  </button>
                  <button
                    onClick={() => audioUploadInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" /> Upload Audio
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {(formData.voiceNotes || []).map((note, index) => (
                <div key={note.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Voice Note #{index + 1}</span>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          voiceNotes: (formData.voiceNotes || []).filter(n => n.id !== note.id)
                        });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={note.title}
                    onChange={e => {
                      const updated = [...(formData.voiceNotes || [])];
                      updated[index].title = e.target.value;
                      setFormData({ ...formData, voiceNotes: updated });
                    }}
                    placeholder="Note Title"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />

                  <input
                    type="text"
                    value={note.audioUrl}
                    onChange={e => {
                      const updated = [...(formData.voiceNotes || [])];
                      updated[index].audioUrl = e.target.value;
                      setFormData({ ...formData, voiceNotes: updated });
                    }}
                    placeholder="Audio URL"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />

                  <input
                    type="text"
                    value={note.duration}
                    onChange={e => {
                      const updated = [...(formData.voiceNotes || [])];
                      updated[index].duration = e.target.value;
                      setFormData({ ...formData, voiceNotes: updated });
                    }}
                    placeholder="Duration (e.g. 01:30)"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: LETTER */}
        {currentStep === 7 && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">7. Love Letter Content</h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Letter Salutation / Title</label>
              <input
                type="text"
                value={formData.letter?.title || ''}
                onChange={e => setFormData({
                  ...formData,
                  letter: { ...(formData.letter || { id: 'l1', memoryId: '', content: '' }), title: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Letter Body Text</label>
              <textarea
                rows={8}
                value={formData.letter?.content || ''}
                onChange={e => setFormData({
                  ...formData,
                  letter: { ...(formData.letter || { id: 'l1', memoryId: '', title: '' }), content: e.target.value }
                })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-serif leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 8: TIMELINE */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">8. Timeline Milestones</h2>
              <button
                onClick={addTimelineEvent}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            <div className="space-y-4">
              {(formData.timeline || []).map((item, index) => (
                <div key={item.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.eventDate}
                    onChange={e => {
                      const updated = [...(formData.timeline || [])];
                      updated[index].eventDate = e.target.value;
                      setFormData({ ...formData, timeline: updated });
                    }}
                    placeholder="Event Date (e.g. Oct 2021)"
                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => {
                      const updated = [...(formData.timeline || [])];
                      updated[index].title = e.target.value;
                      setFormData({ ...formData, timeline: updated });
                    }}
                    placeholder="Milestone Title"
                    className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => {
                        const updated = [...(formData.timeline || [])];
                        updated[index].description = e.target.value;
                        setFormData({ ...formData, timeline: updated });
                      }}
                      placeholder="Short description"
                      className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          timeline: (formData.timeline || []).filter(t => t.id !== item.id)
                        });
                      }}
                      className="text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: MUSIC */}
        {currentStep === 9 && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">9. Background Music</h2>
              <button
                onClick={() => navigateTo('/admin/music')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:border-rose-500 hover:text-white transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Music
              </button>
            </div>
            {music.length === 0 && (
              <p className="text-xs text-neutral-500">
                No tracks in the library yet — use "Upload Music" to add your first background track.
              </p>
            )}
            <div className="space-y-3">
              {music.map(m => (
                <div
                  key={m.id}
                  onClick={() => setFormData({ ...formData, musicId: m.id })}
                  className={`p-4 rounded-2xl bg-neutral-950 border cursor-pointer flex items-center justify-between ${
                    formData.musicId === m.id ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="text-sm font-bold text-white">{m.title}</p>
                      <p className="text-xs text-neutral-400">{m.artist} • {m.category}</p>
                    </div>
                  </div>
                  {formData.musicId === m.id && <CheckCircle2 className="w-5 h-5 text-rose-400" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 10: PREVIEW */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">10. Memory Live Preview</h2>
              <span className="text-xs text-rose-400 font-mono">Live Rendering Engine</span>
            </div>

            <div className="border border-neutral-800 rounded-3xl overflow-hidden bg-neutral-950 max-h-[600px] overflow-y-auto">
              <TemplateRenderer memory={formData as Memory} />
            </div>
          </div>
        )}

        {/* STEP 11: PUBLISH & QR */}
        {currentStep === 11 && (
          <div className="text-center py-10 max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Ready To Publish Gift</h2>
            <p className="text-xs text-neutral-400">
              Publishing will activate the official gift URL and generate high-resolution print QR codes.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white text-xs font-bold shadow-xl cursor-pointer"
              >
                Publish & View QR Code
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-neutral-800 mt-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 disabled:opacity-40 text-neutral-200 text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 11 && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerType !== null}
        onClose={() => { setMediaPickerType(null); setCoverPickerOpen(false); }}
        mediaType={mediaPickerType || undefined}
        onSelect={(item: MediaItem) => {
          if (coverPickerOpen) {
            setFormData(prev => ({ ...prev, coverImage: item.url }));
            setCoverPickerOpen(false);
          } else if (item.type === 'IMAGE') {
            const newPhoto: Photo = {
              id: `p_${Date.now()}`,
              memoryId: formData.id || '',
              imageUrl: item.url,
              caption: item.name,
              displayOrder: (formData.photos?.length || 0) + 1,
            };
            setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), newPhoto] }));
          } else if (item.type === 'VIDEO') {
            const newVideo: Video = {
              id: `v_${Date.now()}`,
              memoryId: formData.id || '',
              videoUrl: item.url,
              caption: item.name,
              displayOrder: (formData.videos?.length || 0) + 1,
            };
            setFormData(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
          } else {
            const newNote: VoiceNote = {
              id: `vn_${Date.now()}`,
              memoryId: formData.id || '',
              title: item.name,
              audioUrl: item.url,
              duration: '00:30',
              displayOrder: (formData.voiceNotes?.length || 0) + 1,
            };
            setFormData(prev => ({ ...prev, voiceNotes: [...(prev.voiceNotes || []), newNote] }));
          }
          setMediaPickerType(null);
        }}
      />

      {/* QR MODAL */}
      {createdMemory && (
        <QRShareModal
          qrValue={`/memory/${createdMemory.slug}`}
          recipientName={createdMemory.recipientName}
          memoryTitle={createdMemory.title}
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
        />
      )}
    </div>
  );
};
