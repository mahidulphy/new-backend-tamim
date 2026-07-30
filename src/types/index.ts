export type Role = 'ADMIN' | 'SUPER_ADMIN';

export type MemoryStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export type QRStatus = 'ACTIVE' | 'DISABLED';

export type TemplateCategory = 'ROMANTIC' | 'ANNIVERSARY' | 'BIRTHDAY' | 'PROPOSAL' | 'VINTAGE' | 'CELEBRATION';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: string;
}

export interface Photo {
  id: string;
  memoryId: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface Video {
  id: string;
  memoryId: string;
  videoUrl: string;
  thumbnail?: string;
  caption?: string;
  displayOrder: number;
}

export interface VoiceNote {
  id: string;
  memoryId: string;
  title: string;
  audioUrl: string;
  duration: string;
  displayOrder: number;
}

export interface TimelineEvent {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  eventDate: string;
  image?: string;
  displayOrder: number;
}

export interface Quote {
  id: string;
  memoryId: string;
  quote: string;
  author: string;
  displayOrder: number;
}

export interface Wish {
  id: string;
  memoryId: string;
  personName: string;
  message: string;
  createdAt: string;
}

export interface Letter {
  id: string;
  memoryId: string;
  title: string;
  content: string;
  fontStyle?: 'serif' | 'sans' | 'handwriting' | 'display';
  textAlignment?: 'left' | 'center' | 'right' | 'justify';
}

export interface BackgroundMusic {
  id: string;
  title: string;
  artist: string;
  musicUrl: string;
  thumbnail?: string;
  category: string;
  duration: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: TemplateCategory;
  thumbnail: string;
  description: string;
  previewImages: string[];
  status: 'ACTIVE' | 'INACTIVE';
  isPremium: boolean;
  displayOrder: number;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeData {
  id: string;
  memoryId: string;
  qrCodeImage: string;
  qrValue: string;
  scanCount: number;
  status: QRStatus;
  foregroundColor: string;
  backgroundColor: string;
  logoUrl?: string;
  style: string;
  downloadCount: number;
  createdAt: string;
  lastScannedAt?: string;
}

export interface QRScanEvent {
  id: string;
  qrId: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  recipientName: string;
  senderName: string;
  relationship: string;
  coverImage?: string;
  coverVideo?: string;
  templateId: string;
  musicId?: string;
  status: MemoryStatus;
  visibility: 'PUBLIC' | 'PRIVATE' | 'PASSWORD_PROTECTED';
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  letter?: Letter;
  photos: Photo[];
  videos: Video[];
  voiceNotes: VoiceNote[];
  timeline: TimelineEvent[];
  quotes: Quote[];
  wishes: Wish[];
}

export interface Order {
  id: string;
  orderNumber: string;
  memoryId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  price: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  templateName: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'VOICE_NOTE';
  url: string;
  name: string;
  size: string;
  mimeType: string;
  publicId?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  supportEmail: string;
  phone: string;
  address: string;
  city: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  whatsapp: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  twitterHandle: string;
  maintenanceMode: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'MEMORY_CREATED' | 'MEMORY_UPDATED' | 'MEMORY_DELETED' | 'MEMORY_ARCHIVED' | 'QR_GENERATED' | 'TEMPLATE_UPDATED' | 'SETTINGS_CHANGED' | 'ADMIN_LOGIN' | 'ORDER_UPDATED';
  target: string;
  description: string;
  ipAddress: string;
  browser: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
