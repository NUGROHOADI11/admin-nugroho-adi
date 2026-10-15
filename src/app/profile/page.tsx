'use client';

import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Share2,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'about' | 'quote'>('general');
  const [activeLang, setActiveLang] = useState<'en' | 'id'>('en');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      setProfile(data);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { id, createdAt, updatedAt, ...updateData } = profile;
      await api.profile.update(updateData);
      setMessage({ type: 'success', text: 'Profile successfully updated!' });
      await loadProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Personal Bio & Portfolio Settings
          </h2>
          <p className="text-xs text-slate-400">
            Customize bio texts, status badges, leadership roles, and social media handles
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'general', label: '1. General & Social' },
          { id: 'hero', label: '2. Hero & Work Status' },
          { id: 'about', label: '3. Bio & Leadership' },
          { id: 'quote', label: '4. Philosophy & Quote' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language switcher pill for multilingual fields */}
        {(activeTab === 'hero' || activeTab === 'about' || activeTab === 'quote') && (
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mr-2">
              Editing Content In:
            </span>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeLang === 'en'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 English (EN)
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('id')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeLang === 'id'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🇮🇩 Indonesian (ID)
            </button>
          </div>
        )}

        {/* 1. General & Social Tab */}
        {activeTab === 'general' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Basic Identity & Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName || ''}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Brand / Navbar Logo Name
                </label>
                <input
                  type="text"
                  value={profile.brand || ''}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Est. Year Tagline
                </label>
                <input
                  type="text"
                  value={profile.est || ''}
                  onChange={(e) => handleChange('est', e.target.value)}
                  placeholder="Est. 2002"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location (English)
                </label>
                <input
                  type="text"
                  value={profile.locationEn || ''}
                  onChange={(e) => handleChange('locationEn', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Location (Indonesian)
                </label>
                <input
                  type="text"
                  value={profile.locationId || ''}
                  onChange={(e) => handleChange('locationId', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3 pt-4">
              Social Media Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  value={profile.githubUrl || ''}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={profile.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Hero & Work Status Tab */}
        {activeTab === 'hero' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Work Status Card ({activeLang === 'en' ? 'English' : 'Indonesian'})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Status Pill Label
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.statusLabelEn || ''
                      : profile.statusLabelId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'statusLabelEn' : 'statusLabelId',
                      e.target.value,
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Availability / Status Description
                </label>
                <textarea
                  rows={2}
                  value={
                    activeLang === 'en'
                      ? profile.statusTextEn || ''
                      : profile.statusTextId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'statusTextEn' : 'statusTextId',
                      e.target.value,
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3 pt-4">
              Homepage Hero Heading ({activeLang === 'en' ? 'English' : 'Indonesian'})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Title Part 1
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.heroTitle1En || ''
                      : profile.heroTitle1Id || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'heroTitle1En' : 'heroTitle1Id',
                      e.target.value,
                    )
                  }
                  placeholder="Growing through"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Highlight Word
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.heroTitleHighlightEn || ''
                      : profile.heroTitleHighlightId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en'
                        ? 'heroTitleHighlightEn'
                        : 'heroTitleHighlightId',
                      e.target.value,
                    )
                  }
                  placeholder="Complexity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Title Part 2
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.heroTitle2En || ''
                      : profile.heroTitle2Id || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'heroTitle2En' : 'heroTitle2Id',
                      e.target.value,
                    )
                  }
                  placeholder="Building for the future."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Subtitle Copy
              </label>
              <textarea
                rows={2}
                value={
                  activeLang === 'en'
                    ? profile.heroSubtitleEn || ''
                    : profile.heroSubtitleId || ''
                }
                onChange={(e) =>
                  handleChange(
                    activeLang === 'en' ? 'heroSubtitleEn' : 'heroSubtitleId',
                    e.target.value,
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* 3. Bio & Leadership Tab */}
        {activeTab === 'about' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              About Bio Description ({activeLang === 'en' ? 'English' : 'Indonesian'})
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                About Headline Title
              </label>
              <input
                type="text"
                value={
                  activeLang === 'en'
                    ? profile.aboutTitleEn || ''
                    : profile.aboutTitleId || ''
                }
                onChange={(e) =>
                  handleChange(
                    activeLang === 'en' ? 'aboutTitleEn' : 'aboutTitleId',
                    e.target.value,
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full About Biography Paragraph
              </label>
              <textarea
                rows={5}
                value={
                  activeLang === 'en'
                    ? profile.aboutDescriptionEn || ''
                    : profile.aboutDescriptionId || ''
                }
                onChange={(e) =>
                  handleChange(
                    activeLang === 'en'
                      ? 'aboutDescriptionEn'
                      : 'aboutDescriptionId',
                    e.target.value,
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3 pt-4">
              Leadership & Community Role ({activeLang === 'en' ? 'English' : 'Indonesian'})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Leadership Role
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.leadershipRoleEn || ''
                      : profile.leadershipRoleId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en'
                        ? 'leadershipRoleEn'
                        : 'leadershipRoleId',
                      e.target.value,
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Leadership Organization
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.leadershipOrgEn || ''
                      : profile.leadershipOrgId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en'
                        ? 'leadershipOrgEn'
                        : 'leadershipOrgId',
                      e.target.value,
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Leadership Description
              </label>
              <textarea
                rows={3}
                value={
                  activeLang === 'en'
                    ? profile.leadershipDescriptionEn || ''
                    : profile.leadershipDescriptionId || ''
                }
                onChange={(e) =>
                  handleChange(
                    activeLang === 'en'
                      ? 'leadershipDescriptionEn'
                      : 'leadershipDescriptionId',
                    e.target.value,
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* 4. Philosophy & Quote Tab */}
        {activeTab === 'quote' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Footer Signature Quote ({activeLang === 'en' ? 'English' : 'Indonesian'})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Quote Part 1
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.quotePart1En || ''
                      : profile.quotePart1Id || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'quotePart1En' : 'quotePart1Id',
                      e.target.value,
                    )
                  }
                  placeholder="“A good task is one that is "
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Highlight Word
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.quoteHighlightEn || ''
                      : profile.quoteHighlightId || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en'
                        ? 'quoteHighlightEn'
                        : 'quoteHighlightId',
                      e.target.value,
                    )
                  }
                  placeholder="finished"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Quote Part 2
                </label>
                <input
                  type="text"
                  value={
                    activeLang === 'en'
                      ? profile.quotePart2En || ''
                      : profile.quotePart2Id || ''
                  }
                  onChange={(e) =>
                    handleChange(
                      activeLang === 'en' ? 'quotePart2En' : 'quotePart2Id',
                      e.target.value,
                    )
                  }
                  placeholder=", because perfection begins..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Quote Author Attribution
              </label>
              <input
                type="text"
                value={profile.quoteAuthor || ''}
                onChange={(e) => handleChange('quoteAuthor', e.target.value)}
                placeholder="— Nugroho Adi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
