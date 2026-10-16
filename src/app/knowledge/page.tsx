'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Bot,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { KnowledgeItem } from '@/lib/knowledge';

interface FormData {
  id?: number;
  category: string;
  heading: string;
  content: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua Kategori' },
  { id: 'bio', label: 'Bio & Profil' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'projects', label: 'Proyek' },
  { id: 'skills', label: 'Skills & Toolkit' },
  { id: 'faq', label: 'FAQ / Tanya Jawab' },
  { id: 'contact', label: 'Kontak' },
];

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category: 'faq',
    heading: '',
    content: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/knowledge');
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      } else {
        throw new Error(json.error || 'Gagal mengambil data knowledge');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      category: 'faq',
      heading: '',
      content: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.metadata?.category || 'general',
      heading: item.metadata?.heading || item.metadata?.title || '',
      content: item.content || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus knowledge chunk ini dari database AI?')) {
      return;
    }

    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg('Chunk berhasil dihapus.');
        setTimeout(() => setSuccessMsg(''), 3000);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        throw new Error(json.error || 'Gagal menghapus chunk');
      }
    } catch (err) {
      alert(`Gagal menghapus: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading.trim() || !formData.content.trim()) {
      setError('Judul / Heading dan Konten tidak boleh kosong.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch('/api/knowledge', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem?.id,
          category: formData.category,
          heading: formData.heading,
          content: formData.content,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Gagal menyimpan knowledge chunk.');
      }

      setSuccessMsg(
        editingItem
          ? 'Knowledge chunk & vector embedding berhasil diperbarui!'
          : 'Knowledge chunk & vector embedding baru berhasil dibuat!'
      );
      setTimeout(() => setSuccessMsg(''), 4000);

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'projects':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'skills':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'experience':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'bio':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'faq':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  const filteredItems = items.filter((item) => {
    const cat = item.metadata?.category || 'general';
    const matchesCat = categoryFilter === 'all' || cat.toLowerCase() === categoryFilter.toLowerCase();
    const heading = item.metadata?.heading || item.metadata?.title || '';
    const content = item.content || '';
    const matchesSearch =
      heading.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase()) ||
      cat.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              AI Knowledge Base (RAG)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Kelola konteks, dokumen portofolio, dan tanya-jawab yang digunakan oleh AI Digital Twin di website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Knowledge Chunk</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Chunks di Supabase
            </p>
            <p className="text-2xl font-bold text-white">{items.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Dimensi Vektor Embedding
            </p>
            <p className="text-2xl font-bold text-white">768 Dim</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Status Sinkronisasi
            </p>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Aktif & Terhubung Supabase
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau isi pengetahuan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chunks List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Memuat database knowledge dari Supabase...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada knowledge chunk yang cocok dengan filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredItems.map((item) => {
              const cat = item.metadata?.category || 'general';
              const heading = item.metadata?.heading || item.metadata?.title || 'Detail';

              return (
                <div
                  key={item.id}
                  className="p-5 hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          cat
                        )}`}
                      >
                        {cat}
                      </span>
                      <h3 className="font-semibold text-sm text-white truncate">
                        {heading}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">
                        #ID {item.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {item.content}
                    </p>

                    {item.created_at && (
                      <p className="text-[10px] text-slate-500">
                        Diperbarui: {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Chunk"
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Hapus Chunk"
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">
                  {editingItem ? 'Edit Knowledge Chunk' : 'Tambah Knowledge Chunk Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="bio">bio (Profil & Ringkasan)</option>
                    <option value="experience">experience (Pengalaman Kerja)</option>
                    <option value="projects">projects (Proyek)</option>
                    <option value="skills">skills (Keahlian & Sertifikasi)</option>
                    <option value="faq">faq (Tanya Jawab Recruiter)</option>
                    <option value="contact">contact (Kontak & Tautan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Judul / Topik Heading
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heading}
                    onChange={(e) =>
                      setFormData({ ...formData, heading: e.target.value })
                    }
                    placeholder="Contoh: Proyek VoiceTask AI"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Isi Konten Pengetahuan (Fakta & Detail)
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Tuliskan detail pengalaman, masalah yang diselesaikan, tech stack, atau jawaban atas pertanyaan..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500 leading-relaxed font-sans resize-y"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-cyan-400">⚡ Otomatisasi Vector Embedding:</p>
                <p>
                  Saat Anda mengklik simpan, sistem akan secara otomatis memanggil Gemini Embedding API untuk membuat representasi vektor 768 dimensi dan menyimpannya ke tabel Supabase.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-medium shadow-md shadow-cyan-500/20 disabled:opacity-50 transition"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menghitung Embedding...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingItem ? 'Simpan Perubahan' : 'Buat Knowledge Chunk'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
