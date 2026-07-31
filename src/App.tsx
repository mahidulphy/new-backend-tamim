import React, { Suspense, lazy, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AdminLayout } from './components/admin/AdminLayout';

const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const PublicMemoryPage = lazy(() => import('./components/public-memory/PublicMemoryPage').then(m => ({ default: m.PublicMemoryPage })));
const AdminLoginPage = lazy(() => import('./components/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const DashboardView = lazy(() => import('./components/admin/DashboardView').then(m => ({ default: m.DashboardView })));
const AllMemoriesView = lazy(() => import('./components/admin/AllMemoriesView').then(m => ({ default: m.AllMemoriesView })));
const MemoryBuilderWizard = lazy(() => import('./components/admin/MemoryBuilderWizard').then(m => ({ default: m.MemoryBuilderWizard })));
const TemplateManagementView = lazy(() => import('./components/admin/TemplateManagementView').then(m => ({ default: m.TemplateManagementView })));
const OrdersView = lazy(() => import('./components/admin/OrdersView').then(m => ({ default: m.OrdersView })));
const QRCodeManagementView = lazy(() => import('./components/admin/QRCodeManagementView').then(m => ({ default: m.QRCodeManagementView })));
const MediaLibraryView = lazy(() => import('./components/admin/MediaLibraryView').then(m => ({ default: m.MediaLibraryView })));
const AnalyticsView = lazy(() => import('./components/admin/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const SettingsView = lazy(() => import('./components/admin/SettingsView').then(m => ({ default: m.SettingsView })));
const ActivityLogsView = lazy(() => import('./components/admin/ActivityLogsView').then(m => ({ default: m.ActivityLogsView })));
const ProfileView = lazy(() => import('./components/admin/ProfileView').then(m => ({ default: m.ProfileView })));
const AdminInboxView = lazy(() => import('./components/admin/AdminInboxView').then(m => ({ default: m.AdminInboxView })));
const NewsletterManagementView = lazy(() => import('./components/admin/NewsletterManagementView').then(m => ({ default: m.NewsletterManagementView })));
const MusicLibraryView = lazy(() => import('./components/admin/MusicLibraryView').then(m => ({ default: m.MusicLibraryView })));

// TEMP (dev only): skip the admin login screen and land directly on the dashboard.
// To re-enable login for production, remove this flag and the two SKIP_ADMIN_LOGIN
// checks below. The login page, auth routes, and dev bypass are untouched.
const SKIP_ADMIN_LOGIN = import.meta.env.DEV || (import.meta.env as Record<string, string | undefined>).VITE_SKIP_ADMIN_LOGIN === 'true';

const RouterContent: React.FC = () => {
  const { currentRoute, isAdminAuthenticated, checkSession } = useApp();

  useEffect(() => {
    if (SKIP_ADMIN_LOGIN && !isAdminAuthenticated && currentRoute.startsWith('/admin')) {
      checkSession();
    }
  }, [SKIP_ADMIN_LOGIN, isAdminAuthenticated, currentRoute, checkSession]);

  // Public Memory View Route (/memory/:slug)
  if (currentRoute.startsWith('/memory/')) {
    const slug = currentRoute.replace('/memory/', '');
    return <PublicMemoryPage slug={slug} />;
  }

  // Admin Login Route
  if (currentRoute === '/admin/login') {
    if (isAdminAuthenticated || SKIP_ADMIN_LOGIN) {
      return (
        <AdminLayout activeKey="dashboard">
          <DashboardView />
        </AdminLayout>
      );
    }
    return <AdminLoginPage />;
  }

  // Protected Admin Routes
  if (currentRoute.startsWith('/admin')) {
    if (!isAdminAuthenticated && !SKIP_ADMIN_LOGIN) {
      return <AdminLoginPage />;
    }

    let activeKey = 'dashboard';
    let content = <DashboardView />;

    if (currentRoute === '/admin/memories') {
      activeKey = 'memories';
      content = <AllMemoriesView />;
    } else if (currentRoute === '/admin/memories/create') {
      activeKey = 'create-memory';
      content = <MemoryBuilderWizard />;
    } else if (currentRoute.startsWith('/admin/memories/edit/')) {
      activeKey = 'memories';
      const memId = currentRoute.replace('/admin/memories/edit/', '');
      content = <MemoryBuilderWizard initialMemoryId={memId} />;
    } else if (currentRoute === '/admin/templates') {
      activeKey = 'templates';
      content = <TemplateManagementView />;
    } else if (currentRoute === '/admin/music') {
      activeKey = 'music';
      content = <MusicLibraryView />;
    } else if (currentRoute === '/admin/orders') {
      activeKey = 'orders';
      content = <OrdersView />;
    } else if (currentRoute === '/admin/qr') {
      activeKey = 'qr-codes';
      content = <QRCodeManagementView />;
    } else if (currentRoute === '/admin/media') {
      activeKey = 'media';
      content = <MediaLibraryView />;
    } else if (currentRoute === '/admin/analytics') {
      activeKey = 'analytics';
      content = <AnalyticsView />;
    } else if (currentRoute === '/admin/settings') {
      activeKey = 'settings';
      content = <SettingsView />;
    } else if (currentRoute === '/admin/logs') {
      activeKey = 'logs';
      content = <ActivityLogsView />;
    } else if (currentRoute === '/admin/inbox') {
      activeKey = 'inbox';
      content = <AdminInboxView />;
    } else if (currentRoute === '/admin/newsletter') {
      activeKey = 'newsletter';
      content = <NewsletterManagementView />;
    } else if (currentRoute === '/admin/profile') {
      activeKey = 'profile';
      content = <ProfileView />;
    }

    return <AdminLayout activeKey={activeKey}>{content}</AdminLayout>;
  }

  // Default: Landing Page
  return <LandingPage />;
};

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <ErrorBoundary>
          <RouterContent />
        </ErrorBoundary>
      </Suspense>
      <ToastContainer />
    </AppProvider>
  );
}
