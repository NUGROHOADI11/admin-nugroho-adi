'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check,
  FolderGit2,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Project {
  id: string;
  slug: string;
  category: string;
  tags: string[];
  link: string;
  icon: string;
  organization: string;
  order: number;
  featured: boolean;
  titleEn: string;
  titleId: string;
  categoryLabelEn: string;
  categoryLabelId: string;
  descriptionEn: string;
  descriptionId: string;
}

const emptyForm: Omit<Project, 'id'> = {
  slug: '',
  category: 'web',
  tags: [],
  link: 'https://github.com/NUGROHOADI11/',
  icon: 'TbCode',
  organization: 'Personal Project',
  order: 1,
  featured: false,
  titleEn: '',
  titleId: '',
  categoryLabelEn: 'Web Development',
  categoryLabelId: 'Pengembangan Web',
  descriptionEn: '',
  descriptionId: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'id'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.projects.getAll({
        category: filterCategory === 'all' ? undefined : filterCategory,
        search: search || undefined,
      });
      setProjects(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filterCategory, search]);

  const handleOpenModal = (project?: Project) => {
    setError('');
    setActiveLangTab('en');
    if (project) {
      setEditingId(project.id);
      setFormData({
        slug: project.slug,
        category: project.category,
        tags: project.tags || [],
        link: project.link,
        icon: project.icon,
        organization: project.organization,
        order: project.order,
        featured: project.featured,
        titleEn: project.titleEn,
        titleId: project.titleId,
        categoryLabelEn: project.categoryLabelEn,
        categoryLabelId: project.categoryLabelId,
        descriptionEn: project.descriptionEn,
        descriptionId: project.descriptionId,
      });
      setTagsInput((project.tags || []).join(', '));
    } else {
      setEditingId(null);
      setFormData(emptyForm);
      setTagsInput('');
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
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: parsedTags,
        order: Number(formData.order),
      };

      if (editingId) {
        await api.projects.update(editingId, payload);
      } else {
        await api.projects.create(payload);
      }

      await loadProjects();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project: "${title}"?`)) return;

    try {
      await api.projects.delete(id);
      await loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {['all', 'web', 'mobile', 'cloud'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                filterCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No projects found. Click &quot;Add Project&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Title (EN / ID)</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Organization</th>
                  <th className="py-3.5 px-6 font-semibold">Tags</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Order</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6 font-medium text-white max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{p.titleEn}</span>
                        {p.featured && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 italic mt-0.5 truncate">
                        ID: {p.titleId}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-700/60">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      {p.organization}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-slate-400 font-mono">
                      {p.order}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.titleEn)}
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {editingId ? 'Edit Project' : 'Add New Project'}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={(e) =>
                        setFormData({ ...formData, titleEn: e.target.value })
                      }
                      placeholder="e.g. Personal Digital Space (Portfolio)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Category Subtitle Label (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.categoryLabelEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryLabelEn: e.target.value,
                        })
                      }
                      placeholder="e.g. Web Engineering"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
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
                      placeholder="Detailed explanation of the case study and architecture..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Judul Proyek (Bahasa Indonesia) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titleId}
                      onChange={(e) =>
                        setFormData({ ...formData, titleId: e.target.value })
                      }
                      placeholder="misal: Ruang Digital Pribadi (Portofolio)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Label Subkategori (Bahasa Indonesia) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.categoryLabelId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryLabelId: e.target.value,
                        })
                      }
                      placeholder="misal: Rekayasa Web"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
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
                      placeholder="Penjelasan studi kasus dalam Bahasa Indonesia..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="portfolio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category Filter Tab *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="cloud">Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    placeholder="e.g. Telkom Indonesia"
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
                    placeholder="TbBrandReact / TbCode / TbCloud"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    External Link / Demo URL
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Display Order
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

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                    />
                    <label
                      htmlFor="featured"
                      className="text-xs text-slate-300 font-medium cursor-pointer"
                    >
                      Featured
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tech Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js, Tailwind CSS, Framer Motion"
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
                  {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
