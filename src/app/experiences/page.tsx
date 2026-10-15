'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Milestone,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Experience {
  id: string;
  slug: string;
  startColumn: number;
  span: number;
  row: number;
  variant: string;
  order: number;
  titleEn: string;
  titleId: string;
  subtitleEn: string;
  subtitleId: string;
  locationEn: string;
  locationId: string;
  dateStringEn: string;
  dateStringId: string;
  bulletsEn: string[];
  bulletsId: string[];
}

const emptyForm: Omit<Experience, 'id'> = {
  slug: '',
  startColumn: 1,
  span: 3,
  row: 1,
  variant: 'green',
  order: 1,
  titleEn: '',
  titleId: '',
  subtitleEn: '',
  subtitleId: '',
  locationEn: '',
  locationId: '',
  dateStringEn: '',
  dateStringId: '',
  bulletsEn: [''],
  bulletsId: [''],
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>(emptyForm);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'id'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await api.experiences.getAll({ search: search || undefined });
      setExperiences(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, [search]);

  const handleOpenModal = (exp?: Experience) => {
    setError('');
    setActiveLangTab('en');
    if (exp) {
      setEditingId(exp.id);
      setFormData({
        slug: exp.slug,
        startColumn: exp.startColumn,
        span: exp.span,
        row: exp.row,
        variant: exp.variant,
        order: exp.order,
        titleEn: exp.titleEn,
        titleId: exp.titleId,
        subtitleEn: exp.subtitleEn,
        subtitleId: exp.subtitleId,
        locationEn: exp.locationEn,
        locationId: exp.locationId,
        dateStringEn: exp.dateStringEn,
        dateStringId: exp.dateStringId,
        bulletsEn: exp.bulletsEn?.length ? exp.bulletsEn : [''],
        bulletsId: exp.bulletsId?.length ? exp.bulletsId : [''],
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

  // Bullet Point handlers
  const handleAddBullet = (lang: 'en' | 'id') => {
    if (lang === 'en') {
      setFormData({ ...formData, bulletsEn: [...formData.bulletsEn, ''] });
    } else {
      setFormData({ ...formData, bulletsId: [...formData.bulletsId, ''] });
    }
  };

  const handleRemoveBullet = (lang: 'en' | 'id', index: number) => {
    if (lang === 'en') {
      const copy = [...formData.bulletsEn];
      copy.splice(index, 1);
      setFormData({ ...formData, bulletsEn: copy.length ? copy : [''] });
    } else {
      const copy = [...formData.bulletsId];
      copy.splice(index, 1);
      setFormData({ ...formData, bulletsId: copy.length ? copy : [''] });
    }
  };

  const handleBulletChange = (
    lang: 'en' | 'id',
    index: number,
    value: string,
  ) => {
    if (lang === 'en') {
      const copy = [...formData.bulletsEn];
      copy[index] = value;
      setFormData({ ...formData, bulletsEn: copy });
    } else {
      const copy = [...formData.bulletsId];
      copy[index] = value;
      setFormData({ ...formData, bulletsId: copy });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        startColumn: Number(formData.startColumn),
        span: Number(formData.span),
        row: Number(formData.row),
        order: Number(formData.order),
        bulletsEn: formData.bulletsEn.map((b) => b.trim()).filter(Boolean),
        bulletsId: formData.bulletsId.map((b) => b.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.experiences.update(editingId, payload);
      } else {
        await api.experiences.create(payload);
      }

      await loadExperiences();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save experience.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete experience milestone: "${title}"?`))
      return;

    try {
      await api.experiences.delete(id);
      await loadExperiences();
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Timeline Milestones ({experiences.length})
          </h2>
          <p className="text-xs text-slate-400">
            Powers the 24-column interactive Gantt timeline on the home page
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiences..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      {/* Experiences Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading timeline experiences...
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No experiences found. Click &quot;Add Experience&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Title & Role</th>
                  <th className="py-3.5 px-6 font-semibold">Date String</th>
                  <th className="py-3.5 px-6 font-semibold">Location</th>
                  <th className="py-3.5 px-6 font-semibold text-center">
                    Grid Position
                  </th>
                  <th className="py-3.5 px-6 font-semibold text-center">Variant</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6 font-medium text-white max-w-xs">
                      <div className="font-semibold text-white">{exp.titleEn}</div>
                      <div className="text-[11px] text-emerald-400 font-normal">
                        {exp.subtitleEn}
                      </div>
                      <div className="text-[10px] text-slate-500 italic mt-0.5">
                        ID: {exp.titleId} • {exp.subtitleId}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-mono">
                      {exp.dateStringEn}
                    </td>
                    <td className="py-4 px-6 text-slate-400">{exp.locationEn}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-mono bg-slate-800 px-2 py-1 rounded text-[11px] text-slate-300">
                        C:{exp.startColumn} S:{exp.span} R:{exp.row}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          exp.variant === 'green'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : exp.variant === 'dark'
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {exp.variant}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.titleEn)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Milestone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {editingId ? 'Edit Timeline Milestone' : 'Add New Milestone'}
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
                        Title / Company (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titleEn}
                        onChange={(e) =>
                          setFormData({ ...formData, titleEn: e.target.value })
                        }
                        placeholder="e.g. Telkom Indonesia (MSIB 7)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subtitle / Role (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subtitleEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subtitleEn: e.target.value,
                          })
                        }
                        placeholder="e.g. Developer Intern"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Date String (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.dateStringEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateStringEn: e.target.value,
                          })
                        }
                        placeholder="e.g. Sep 2024 — Dec 2024"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Location (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.locationEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationEn: e.target.value,
                          })
                        }
                        placeholder="e.g. Jakarta, Indonesia"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Bullets List (English) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Popup Modal Bullet Points (English)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet('en')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add Bullet
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.bulletsEn.map((bullet, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) =>
                              handleBulletChange('en', idx, e.target.value)
                            }
                            placeholder={`Point ${idx + 1}...`}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet('en', idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Judul / Perusahaan (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titleId}
                        onChange={(e) =>
                          setFormData({ ...formData, titleId: e.target.value })
                        }
                        placeholder="misal: Telkom Indonesia (MSIB 7)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subjudul / Peran (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subtitleId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subtitleId: e.target.value,
                          })
                        }
                        placeholder="misal: Intern Pengembang"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Rentang Tanggal (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.dateStringId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateStringId: e.target.value,
                          })
                        }
                        placeholder="misal: Sep 2024 — Des 2024"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Lokasi (Bahasa Indonesia) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.locationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationId: e.target.value,
                          })
                        }
                        placeholder="misal: Jakarta, Indonesia"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Bullets List (Indonesian) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Poin Rincian Modal Popup (Bahasa Indonesia)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet('id')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Tambah Poin
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.bulletsId.map((bullet, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) =>
                              handleBulletChange('id', idx, e.target.value)
                            }
                            placeholder={`Poin ${idx + 1}...`}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet('id', idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Timeline Grid Coordinates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Start Column (1-24) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={formData.startColumn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startColumn: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Col Span (1-24) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={formData.span}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        span: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Row Track (1-5) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.row}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        row: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Color Variant *
                  </label>
                  <select
                    value={formData.variant}
                    onChange={(e) =>
                      setFormData({ ...formData, variant: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="green">Green (Featured / Work)</option>
                    <option value="gray">Gray (Education / Training)</option>
                    <option value="dark">Dark (Leadership / High Impact)</option>
                  </select>
                </div>
              </div>

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
                    placeholder="telkomMsib"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Sorting Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
                  {saving ? 'Saving...' : editingId ? 'Update Milestone' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
