import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, HeartHandshake, PlusCircle, Palette, Package, 
  QrCode, FolderOpen, BarChart3, Settings, ScrollText, User, 
  Mail, Users,
  LogOut, Menu, X, Search, Bell, Sun, Moon, Gift, Sparkles, ChevronRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeKey: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeKey }) => {
  const { user, logoutAdmin, navigateTo, darkMode, toggleDarkMode, searchQuery, setSearchQuery } = useApp();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
    { key: 'memories', label: 'Memories', icon: HeartHandshake, route: '/admin/memories' },
    { key: 'create-memory', label: 'Create Memory', icon: PlusCircle, route: '/admin/memories/create' },
    { key: 'templates', label: 'Templates', icon: Palette, route: '/admin/templates' },
    { key: 'orders', label: 'Orders', icon: Package, route: '/admin/orders' },
    { key: 'qr-codes', label: 'QR Codes', icon: QrCode, route: '/admin/qr' },
    { key: 'media', label: 'Media Library', icon: FolderOpen, route: '/admin/media' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'inbox', label: 'Inbox', icon: Mail, route: '/admin/inbox' },
    { key: 'newsletter', label: 'Newsletter', icon: Users, route: '/admin/newsletter' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
    { key: 'logs', label: 'Activity Logs', icon: ScrollText, route: '/admin/logs' },
    { key: 'profile', label: 'Profile', icon: User, route: '/admin/profile' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 bg-grid-pattern-sm text-neutral-100 flex font-sans selection:bg-rose-500 selection:text-white">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col border-r border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand */}
        <div className="h-20 border-b border-neutral-800/80 px-5 flex items-center justify-between shrink-0">
          <div 
            onClick={() => navigateTo('/admin/dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shrink-0 shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <span className="text-base font-bold text-white tracking-tight truncate">
                MEMORY<span className="text-rose-500">GIFT</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-neutral-500 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigateTo(item.route)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600/15 border border-rose-500/30 text-rose-400 shadow-md shadow-rose-950/20'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-neutral-800/80 shrink-0">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center gap-3 min-w-0">
              <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-700" />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-rose-400 truncate font-mono">{user?.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={logoutAdmin}
              className="text-neutral-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9980] bg-black/80 backdrop-blur-md md:hidden flex">
          <div className="w-72 bg-neutral-900 border-r border-neutral-800 h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white">MEMORYGIFT</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeKey === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { setMobileMenuOpen(false); navigateTo(item.route); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button onClick={logoutAdmin} className="w-full py-3 rounded-xl bg-neutral-800 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-20 border-b border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-neutral-400 hover:text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="text-neutral-500">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              <span className="text-white capitalize">{activeKey.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Global search memories, templates, orders..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-white text-xs focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/admin/memories/create')}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quick Create
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50">
                  <h4 className="text-xs font-bold text-white mb-3">System Activity</h4>
                  <div className="space-y-2.5 text-xs text-neutral-300">
                    <p className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                      <strong className="text-rose-400">QR Scan:</strong> "Rose Garden Proposal" was scanned in Seattle.
                    </p>
                    <p className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                      <strong className="text-emerald-400">Order Completed:</strong> MG-8821 paid ($49.00).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>

            {/* Admin Avatar */}
            <div 
              onClick={() => navigateTo('/admin/profile')}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            >
              <img src={user?.avatar} alt="Admin" className="w-8 h-8 rounded-full object-cover border border-neutral-700" />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
