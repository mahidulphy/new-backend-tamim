import React, { useState } from 'react';
import { User, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { user, updateUser, addToast } = useApp();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', avatar: user?.avatar || '' });
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });
  const [confirmModal, setConfirmModal] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.next !== passForm.confirm) {
      addToast('Password Mismatch', 'New password and confirmation do not match.', 'warning');
      return;
    }
    setConfirmModal(true);
  };

  const confirmPasswordChange = () => {
    setConfirmModal(false);
    setPassForm({ current: '', next: '', confirm: '' });
    addToast('Password Updated', 'Admin account password updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Admin Profile & Security</h1>
        <p className="text-xs text-neutral-400">Manage credentials and administrative permissions.</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-rose-400" /> Profile Information
        </h3>

        <div className="flex items-center gap-5 mb-4">
          <img src={profileForm.avatar} alt={profileForm.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-xl" />
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-neutral-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] uppercase font-bold">
              {user?.role} Access
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Avatar URL</label>
            <input
              type="text"
              value={profileForm.avatar}
              onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-sm shadow-lg cursor-pointer mt-2"
        >
          Save Profile Changes
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-rose-400" /> Security Credentials Update
        </h3>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Current Password</label>
          <input
            type="password"
            required
            value={passForm.current}
            onChange={e => setPassForm({ ...passForm, current: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">New Password</label>
          <input
            type="password"
            required
            value={passForm.next}
            onChange={e => setPassForm({ ...passForm, next: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            value={passForm.confirm}
            onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white font-semibold text-sm shadow-lg cursor-pointer mt-4"
        >
          Update Password
        </button>
      </form>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Confirm Security Update?</h3>
            <p className="text-xs text-neutral-400">Are you sure you want to change your administrative account password?</p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordChange}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
