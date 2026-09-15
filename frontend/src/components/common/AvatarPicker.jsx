import React, { useState } from 'react';
import { Check, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';

export const AVATAR_PRESETS = [
  // 3D & Tech Portraits
  { id: 'tech-1', label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'tech-2', label: 'Senior Dev', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'tech-3', label: 'Product Designer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'tech-4', label: 'Project Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'tech-5', label: 'UX Researcher', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'tech-6', label: 'DevOps Lead', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },

  // Vector & Illustrated Art
  { id: 'vec-1', label: 'Avataaars Modern', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'vec-2', label: 'Avataaars Creative', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'vec-3', label: 'Cyber Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TaskSphere' },
  { id: 'vec-4', label: 'Illustrated Girl', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jessica' },
  { id: 'vec-5', label: 'Illustrated Guy', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael' },
  { id: 'vec-6', label: 'Happy Emoji', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy' },

  // Expressive & Minimal
  { id: 'min-1', label: 'Smiley Star', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Smile' },
  { id: 'min-2', label: 'Pixel Hero', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hero' },
  { id: 'min-3', label: 'Geometric Ring', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Sphere' },
  { id: 'min-4', label: 'Minimal Art', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Modern' }
];

export const AvatarPicker = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [customUrl, setCustomUrl] = useState('');

  const handleSelect = (url) => {
    onChange(url);
  };

  const handleCustomUrlApply = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'gallery'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Preset Avatars ({AVATAR_PRESETS.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'custom'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Custom URL / Upload
        </button>
      </div>

      {/* Preset Avatar Grid */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-56 overflow-y-auto p-1 scrollbar-thin">
          {AVATAR_PRESETS.map((item) => {
            const isSelected = value === item.url;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.url)}
                className={`group relative flex flex-col items-center p-1.5 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/50 scale-105'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                title={item.label}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 mt-1 truncate w-full text-center">
                  {item.label}
                </span>

                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Link & Upload Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleCustomUrlApply} className="flex gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Apply URL
            </button>
          </form>

          <div className="flex items-center gap-3 pt-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all">
              <Upload className="w-3.5 h-3.5 text-blue-500" />
              <span>Upload Local Image File</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-slate-400">JPG, PNG, GIF up to 5MB</span>
          </div>
        </div>
      )}
    </div>
  );
};
