'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Award, X } from 'lucide-react';
import { api } from '@/lib/api';

interface Achievement {
  id: string;
  slug: string;
  icon: string;
  highlightColor: string;
  order: number;
  metricEn: string;
  metricId: string;
  labelEn: string;
  labelId: string;
  descriptionEn: string;
  descriptionId: string;
}

const colorPresets = [
  {
    name: 'Amber (DigiHack)',
    class:
      'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',
  },
  {
    name: 'Orange (Alibaba Cloud)',
    class:
      'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/30',
  },
  {
    name: 'Blue (AWS Cloud)',
    class:
      'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',
  },
  {
    name: 'Emerald (MSIB)',
    class:
      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30',
  },
  {
    name: 'Purple (American Corner)',
    class:
      'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30',
  },
  {
    name: 'Dark Slate (Digistar)',
    class:
      'text-neutral-900 dark:text-neutral-100 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800',
  },
];

const emptyForm: Omit<Achievement, 'id'> = {
  slug: '',
  icon: 'FiAward',
  highlightColor: colorPresets[0].class,
  order: 1,
  metricEn: '',
  metricId: '',
  labelEn: '',
  labelId: '',
  descriptionEn: '',
  descriptionId: '',
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>(emptyForm);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'id'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await api.achievements.getAll({ search: search || undefined });
      setAchievements(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [search]);

  const handleOpenModal = (ach?: Achievement) => {
    setError('');
    setActiveLangTab('en');
    if (ach) {
      setEditingId(ach.id);
      setFormData({
        slug: ach.slug,
        icon: ach.icon,
        highlightColor: ach.highlightColor,
        order: ach.order,
        metricEn: ach.metricEn,
        metricId: ach.metricId,
        labelEn: ach.labelEn,
        labelId: ach.labelId,
        descriptionEn: ach.descriptionEn,
        descriptionId: ach.descriptionId,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        order: Number(formData.order),
      };

      if (editingId) {
        await api.achievements.update(editingId, payload);
      } else {
        await api.achievements.create(payload);
      }

      await loadAchievements();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save achievement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete achievement: "${label}"?`))
      return;

    try {
      await api.achievements.delete(id);
      await loadAchievements();
    } catch (err: any) {
      alert(err.message || 'Failed to delete achievement.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Key Achievements & Awards ({achievements.length})
          </h2>
          <p className="text-xs text-slate-400">
            Showcase certifications, hackathon rankings, and competitive badges
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search achievements..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading achievements...
          </div>
        ) : achievements.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 text-xs">
            No achievements found. Click &quot;Add Achievement&quot; to create one.
          </div>
        ) : (
          achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-sm relative group"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {ach.labelEn}
                    </span>
                    <span className="text-2xl font-bold text-white tracking-tight block">
                      {ach.metricEn}
                    </span>
                    <span className="text-[11px] text-slate-500 italic mt-0.5 block">
                      ID: {ach.metricId} • {ach.labelId}
                    </span>
                  </div>

                  <div className={`p-3 rounded-2xl border text-xs font-mono font-bold shrink-0 ${ach.highlightColor}`}>
                    {ach.icon}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {ach.descriptionEn}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  Slug: {ach.slug} • #{ach.order}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(ach)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ach.id, ach.labelEn)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {editingId ? 'Edit Achievement' : 'Add New Achievement'}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-2">
                  Content Language:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeLangTab === 'en'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('id')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeLangTab === 'id'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🇮🇩 Indonesian (ID)
                </button>
              </div>

              {/* Localized Inputs */}
              {activeLangTab === 'en' ? (
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Metric / Award Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.metricEn}
                        onChange={(e) =>
                          setFormData({ ...formData, metricEn: e.target.value })
                        }
                        placeholder="e.g. Semi-Finalist / Certified"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Event / Program Label (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.labelEn}
                        onChange={(e) =>
                          setFormData({ ...formData, labelEn: e.target.value })
                        }
                        placeholder="e.g. DigiHack 2025"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Description (English) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      placeholder="Detailed explanation of the achievement..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Metrik / Predikat (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.metricId}
                        onChange={(e) =>
                          setFormData({ ...formData, metricId: e.target.value })
                        }
                        placeholder="misal: Semi-Finalis / Tersertifikasi"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nama Ajang / Program (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.labelId}
                        onChange={(e) =>
                          setFormData({ ...formData, labelId: e.target.value })
                        }
                        placeholder="misal: DigiHack 2025"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Deskripsi (Bahasa Indonesia) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.descriptionId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionId: e.target.value,
                        })
                      }
                      placeholder="Penjelasan prestasi dalam Bahasa Indonesia..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Identifier Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="digihack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="FiAward / FiCloud / FiCheckCircle"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Highlight Color Theme
                </label>
                <select
                  value={formData.highlightColor}
                  onChange={(e) =>
                    setFormData({ ...formData, highlightColor: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {colorPresets.map((preset) => (
                    <option key={preset.name} value={preset.class}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Achievement' : 'Create Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
