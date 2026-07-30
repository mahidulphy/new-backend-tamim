import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Memory, Template, BackgroundMusic, Order, QRCodeData, 
  MediaItem, SiteSettings, ActivityLog, User, ToastMessage, ContactMessage, NewsletterSubscriber
} from '../types';
import { api } from '../api';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Memory Gift',
  siteLogo: '',
  favicon: '',
  primaryColor: '#E11D48',
  secondaryColor: '#D97706',
  supportEmail: 'concierge@memorygift.com',
  phone: '',
  address: '',
  city: '',
  facebook: '',
  instagram: '',
  youtube: '',
  twitter: '',
  linkedin: '',
  tiktok: '',
  whatsapp: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  twitterHandle: '',
  maintenanceMode: false,
};

interface AppContextType {
  user: User | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;

  memories: Memory[];
  templates: Template[];
  music: BackgroundMusic[];
  orders: Order[];
  qrs: QRCodeData[];
  media: MediaItem[];
  settings: SiteSettings;
  logs: ActivityLog[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  fetchContactMessages: () => Promise<void>;
  fetchNewsletterSubscribers: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  toasts: ToastMessage[];
  loading: boolean;

  currentRoute: string;
  navigateTo: (route: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  saveMemory: (memoryData: Partial<Memory>) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  duplicateMemory: (id: string) => Promise<Memory | null>;
  archiveMemory: (id: string) => Promise<void>;

  updateTemplateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') => Promise<void>;
  duplicateTemplate: (id: string) => Promise<void>;

  generateOrUpdateQR: (memoryId: string, customSlug?: string, targetTitle?: string, opts?: { foregroundColor?: string; backgroundColor?: string; style?: string }) => Promise<QRCodeData>;
  customizeQR: (id: string, opts: { foregroundColor?: string; backgroundColor?: string; logoUrl?: string | null; style?: string }) => Promise<QRCodeData>;
  bulkGenerateQR: (memoryIds: string[], opts?: { foregroundColor?: string; backgroundColor?: string; style?: string }) => Promise<QRCodeData[]>;
  incrementQRScan: (memorySlug: string) => Promise<void>;
  incrementMemoryView: (memorySlug: string) => Promise<void>;

  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<MediaItem>;
  deleteMediaItem: (id: string) => Promise<void>;
  logActivity: (action: ActivityLog['action'], target: string, description: string) => Promise<void>;

  getMemoryBySlug: (slug: string) => Memory | undefined;
  getTemplateById: (id: string) => Template | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [music, setMusic] = useState<BackgroundMusic[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [qrs, setQrs] = useState<QRCodeData[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentRoute(route);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [u, mems, tmpls, mus, ords, qrsData, med, sett, lgs] = await Promise.all([
        api.users.getCurrent().catch(() => null),
        api.memories.list().catch(() => []),
        api.templates.list().catch(() => []),
        api.music.list().catch(() => []),
        api.orders.list().catch(() => []),
        api.qr.list().catch(() => []),
        api.media.list().catch(() => []),
        api.settings.get().catch(() => null),
        api.logs.list().catch(() => []),
      ]);
      if (u) setUser(u);
      setMemories(mems);
      setTemplates(tmpls);
      setMusic(mus);
      setOrders(ords);
      setQrs(qrsData);
      setMedia(med);
      setSettings(sett);
      setLogs(lgs);
    } catch (e) {
      console.error('Failed to fetch initial data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.auth.getSession().then(sessionUser => {
      if (sessionUser) {
        setUser(sessionUser);
        setIsAdminAuthenticated(true);
      }
    }).catch(() => {}).finally(() => {
      setSessionChecked(true);
    });
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAll();
    } else if (sessionChecked) {
      setLoading(false);
    }
  }, [isAdminAuthenticated, sessionChecked, fetchAll]);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchContactMessages = async () => {
    try {
      const res = await fetch('/api/contact', { credentials: 'include' });
      const json = await res.json();
      setContactMessages(json.data || []);
    } catch {}
  };

  const fetchNewsletterSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter/subscribers', { credentials: 'include' });
      const json = await res.json();
      setNewsletterSubscribers(json.data || []);
    } catch {}
  };

  const markMessageRead = async (id: string) => {
    try {
      await fetch(`/api/contact/${id}/read`, { method: 'PUT', credentials: 'include' });
      setContactMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch {}
  };

  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE', credentials: 'include' });
      setContactMessages(prev => prev.filter(m => m.id !== id));
    } catch {}
  };

  const deleteSubscriber = async (id: string) => {
    try {
      await fetch(`/api/newsletter/subscribers/${id}`, { method: 'DELETE', credentials: 'include' });
      setNewsletterSubscribers(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const logActivity = async (action: ActivityLog['action'], target: string, description: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      adminId: user?.id || 'sys',
      adminName: user?.name || 'System Administrator',
      action,
      target,
      description,
      ipAddress: '127.0.0.1',
      browser: 'Browser App Engine',
      createdAt: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
    try {
      await api.logs.create(newLog);
    } catch {}
  };

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const u = await api.auth.login(email, pass);
      setUser(u);
      setIsAdminAuthenticated(true);
      logActivity('ADMIN_LOGIN', 'Admin Dashboard', 'Administrator logged into management portal.');
      addToast('Welcome Back', 'Logged in as System Administrator.', 'success');
      return true;
    } catch (e: any) {
      addToast('Authentication Failed', e.message || 'Please check your admin credentials.', 'error');
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await api.auth.logout();
    } catch {}
    setUser(null);
    setIsAdminAuthenticated(false);
    addToast('Logged Out', 'Successfully logged out of Admin Panel.', 'info');
    navigateTo('/admin/login');
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await api.users.updateCurrent(data);
      setUser(updated);
      addToast('Profile Updated', 'Admin profile changes saved successfully.', 'success');
    } catch {
      addToast('Error', 'Failed to update profile.', 'error');
    }
  };

  const saveMemory = async (data: Partial<Memory>): Promise<Memory> => {
    const isNew = !data.id;
    try {
      let memory: Memory;
      if (isNew) {
        memory = await api.memories.create(data);
        setMemories(prev => [memory, ...prev]);
        logActivity('MEMORY_CREATED', memory.title, `Created new memory for recipient: ${memory.recipientName}`);
        addToast('Memory Created', `Memory "${memory.title}" has been saved.`, 'success');
      } else {
        if (!data.id) throw new Error('Memory ID is required for update');
        memory = await api.memories.update(data.id, data);
        setMemories(prev => prev.map(m => m.id === memory.id ? memory : m));
        logActivity('MEMORY_UPDATED', memory.title, `Updated memory content and settings.`);
        addToast('Memory Saved', `Changes to "${memory.title}" were saved.`, 'success');
      }
      return memory;
    } catch (e: any) {
      addToast('Error', e.message || 'Failed to save memory.', 'error');
      throw e;
    }
  };

  const deleteMemory = async (id: string) => {
    const target = memories.find(m => m.id === id);
    if (!target) return;
    try {
      await api.memories.delete(id);
      setMemories(prev => prev.filter(m => m.id !== id));
      setQrs(prev => prev.filter(q => q.memoryId !== id));
      logActivity('MEMORY_DELETED', target.title, `Deleted memory and associated QR record.`);
      addToast('Memory Deleted', `"${target.title}" has been permanently removed.`, 'info');
    } catch {
      addToast('Error', 'Failed to delete memory.', 'error');
    }
  };

  const duplicateMemory = async (id: string): Promise<Memory | null> => {
    try {
      const duplicated = await api.memories.duplicate(id);
      setMemories(prev => [duplicated, ...prev]);
      try {
        const qr = await api.qr.create(duplicated.id, `/memory/${duplicated.slug}`);
        setQrs(prev => [qr, ...prev]);
      } catch {}
      logActivity('MEMORY_CREATED', duplicated.title, `Duplicated memory.`);
      addToast('Memory Duplicated', `Created a copy: "${duplicated.title}".`, 'success');
      return duplicated;
    } catch {
      addToast('Error', 'Failed to duplicate memory.', 'error');
      return null;
    }
  };

  const archiveMemory = async (id: string) => {
    const target = memories.find(m => m.id === id);
    try {
      const archived = await api.memories.updateStatus(id, 'ARCHIVED');
      setMemories(prev => prev.map(m => m.id === id ? archived : m));
      logActivity('MEMORY_ARCHIVED', target?.title || id, `Memory archived.`);
      addToast('Memory Archived', `"${target?.title || id}" has been archived.`, 'info');
    } catch {
      addToast('Error', 'Failed to archive memory.', 'error');
    }
  };

  const updateTemplateStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    const tmpl = templates.find(t => t.id === id);
    try {
      const updated = await api.templates.updateStatus(id, status);
      setTemplates(prev => prev.map(t => t.id === id ? updated : t));
      logActivity('TEMPLATE_UPDATED', tmpl?.name || id, `Changed template status to ${status}.`);
      addToast('Template Status Updated', `Template set to ${status}.`, 'info');
    } catch {
      addToast('Error', 'Failed to update template status.', 'error');
    }
  };

  const duplicateTemplate = async (id: string) => {
    try {
      const dup = await api.templates.duplicate(id);
      setTemplates(prev => [...prev, dup]);
      addToast('Template Duplicated', `Created custom template copy.`, 'success');
    } catch {
      addToast('Error', 'Failed to duplicate template.', 'error');
    }
  };

  const generateOrUpdateQR = async (memoryId: string, customSlug?: string, targetTitle?: string, opts?: { foregroundColor?: string; backgroundColor?: string; style?: string }): Promise<QRCodeData> => {
    const slug = customSlug || memoryId;
    const qrValue = `/memory/${slug}`;
    try {
      const qr = await api.qr.create(memoryId, qrValue, opts);
      setQrs(prev => {
        const filtered = prev.filter(q => q.memoryId !== memoryId);
        return [qr, ...filtered];
      });
      logActivity('QR_GENERATED', targetTitle || slug, `Generated official QR code record.`);
      return qr;
    } catch {
      const fallback: QRCodeData = {
        id: `qr_${Date.now()}`,
        memoryId,
        qrCodeImage: '',
        qrValue,
        scanCount: 0,
        foregroundColor: opts?.foregroundColor || '#000000',
        backgroundColor: opts?.backgroundColor || '#FFFFFF',
        style: opts?.style || 'standard',
        downloadCount: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      setQrs(prev => {
        const filtered = prev.filter(q => q.memoryId !== memoryId);
        return [fallback, ...filtered];
      });
      return fallback;
    }
  };

  const customizeQR = async (id: string, opts: { foregroundColor?: string; backgroundColor?: string; logoUrl?: string | null; style?: string }) => {
    try {
      const updated = await api.qr.customize(id, opts);
      setQrs(prev => prev.map(q => q.id === id ? updated : q));
      addToast('QR Customized', 'QR code branding updated successfully.', 'success');
      return updated;
    } catch {
      addToast('Error', 'Failed to update QR customization.', 'error');
      throw new Error('Failed to customize QR');
    }
  };

  const bulkGenerateQR = async (memoryIds: string[], opts?: { foregroundColor?: string; backgroundColor?: string; style?: string }) => {
    try {
      const result = await api.qr.bulk(memoryIds, opts);
      setQrs(prev => {
        const filtered = prev.filter(q => !memoryIds.includes(q.memoryId));
        return [...result.data, ...filtered];
      });
      addToast('QR Codes Generated', `Generated ${result.generated} QR codes.`, 'success');
      return result.data;
    } catch {
      addToast('Error', 'Failed to bulk generate QR codes.', 'error');
      return [];
    }
  };

  const incrementQRScan = async (memorySlug: string) => {
    const targetMem = memories.find(m => m.slug === memorySlug);
    if (!targetMem) return;
    const qrRecord = qrs.find(q => q.memoryId === targetMem.id);
    if (!qrRecord) return;
    try {
      const updated = await api.qr.incrementScan(qrRecord.id);
      setQrs(prev => prev.map(q => q.id === qrRecord.id ? updated : q));
    } catch {
      setQrs(prev => prev.map(q => {
        if (q.memoryId === targetMem.id) {
          return { ...q, scanCount: q.scanCount + 1, lastScannedAt: new Date().toISOString() };
        }
        return q;
      }));
    }
  };

  const incrementMemoryView = async (memorySlug: string) => {
    const targetMem = memories.find(m => m.slug === memorySlug);
    if (!targetMem) return;
    try {
      const updated = await api.memories.incrementView(targetMem.id);
      setMemories(prev => prev.map(m => m.id === targetMem.id ? updated : m));
    } catch {
      setMemories(prev => prev.map(m => {
        if (m.slug === memorySlug) {
          return { ...m, viewCount: m.viewCount + 1 };
        }
        return m;
      }));
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      const updated = await api.orders.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      logActivity('ORDER_UPDATED', orderId, `Order status updated to ${status}.`);
      addToast('Order Status Updated', `Order ${orderId} marked as ${status}.`, 'success');
    } catch {
      addToast('Error', 'Failed to update order status.', 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = await api.settings.update(newSettings);
      setSettings(updated);
      logActivity('SETTINGS_CHANGED', 'Platform Settings', 'Admin updated platform configurations.');
      addToast('Settings Saved', 'Platform settings updated successfully.', 'success');
    } catch {
      addToast('Error', 'Failed to update settings.', 'error');
    }
  };

  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> => {
    try {
      const newMedia = await api.media.create(item);
      setMedia(prev => [newMedia, ...prev]);
      addToast('Media Added', `File "${item.name}" saved to library.`, 'success');
      return newMedia;
    } catch {
      const fallback: MediaItem = {
        ...item,
        id: `med_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setMedia(prev => [fallback, ...prev]);
      addToast('Media Added', `File "${item.name}" saved to library.`, 'success');
      return fallback;
    }
  };

  const deleteMediaItem = async (id: string) => {
    try {
      await api.media.delete(id);
      setMedia(prev => prev.filter(m => m.id !== id));
      addToast('Media Removed', `File removed from library.`, 'info');
    } catch {
      addToast('Error', 'Failed to delete media item.', 'error');
    }
  };

  const getMemoryBySlug = (slug: string) => {
    return memories.find(m => m.slug === slug);
  };

  const getTemplateById = (id: string) => {
    return templates.find(t => t.id === id);
  };

  return (
    <AppContext.Provider value={{
      user,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      updateUser,
      memories,
      templates,
      music,
      orders,
      qrs,
      media,
      settings: settings || DEFAULT_SETTINGS,
      logs,
      contactMessages,
      newsletterSubscribers,
      fetchContactMessages,
      fetchNewsletterSubscribers,
      markMessageRead,
      deleteMessage,
      deleteSubscriber,
      toasts,
      loading,
      currentRoute,
      navigateTo,
      darkMode,
      toggleDarkMode,
      searchQuery,
      setSearchQuery,
      addToast,
      removeToast,
      saveMemory,
      deleteMemory,
      duplicateMemory,
      archiveMemory,
      updateTemplateStatus,
      duplicateTemplate,
      generateOrUpdateQR,
      customizeQR,
      bulkGenerateQR,
      incrementQRScan,
      incrementMemoryView,
      updateOrderStatus,
      updateSettings,
      addMediaItem,
      deleteMediaItem,
      logActivity,
      getMemoryBySlug,
      getTemplateById,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
