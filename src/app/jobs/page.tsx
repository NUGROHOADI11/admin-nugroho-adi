'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Sparkles,
  ExternalLink,
  Mail,
  Printer,
  Copy,
  Check,
  Building,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  FileText,
  BookmarkCheck,
  Trash2,
  SlidersHorizontal,
  X,
  Send,
  UserCheck,
  Globe,
  Compass,
  Download,
} from 'lucide-react';
import HarvardResume, { HarvardCvData, DEFAULT_HARVARD_CV_DATA } from '@/components/cv/HarvardResume';

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experienceLevel?: string;
  tags: string[];
  salary?: string | null;
  url: string;
  description: string;
  postedAt: string;
  source: string;
  logo?: string | null;
}

interface TailoredApplication {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobUrl?: string;
  recruiterEmail?: string;
  matchScore: number;
  matchSummary: string;
  strengths: string[];
  keywordsToHighlight: string[];
  harvardCv: HarvardCvData;
  emailPitch: {
    subject: string;
    body: string;
  };
  linkedinPitch: {
    message: string;
  };
  originalDescription?: string;
  status: 'Draft' | 'Approved' | 'Sent Email' | 'Applied LinkedIn' | 'Interviewing';
  createdAt: string;
}

const INDONESIA_SOURCES = [
  { id: 'all_id', label: '🇮🇩 Semua Loker ID' },
  { id: 'linkedin', label: '💼 LinkedIn Indonesia' },
  { id: 'jobstreet', label: '🏢 Jobstreet ID' },
  { id: 'kalibrr', label: '⚡ Kalibrr Indonesia' },
  { id: 'remotive', label: '🌐 Remote Global' },
];

const INDONESIA_LOCATIONS = [
  'Indonesia',
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Remote Indonesia',
];

const PRESET_KEYWORDS = [
  'Junior Full Stack Developer',
  'Junior Backend Go',
  'Junior Backend Java',
  'Frontend React Associate',
  'Junior Cloud DevOps',
  'Junior Mobile Flutter',
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'custom' | 'history'>('browse');

  // Search state
  const [query, setQuery] = useState('full stack');
  const [source, setSource] = useState('all_id');
  const [location, setLocation] = useState('Indonesia');
  const [expLevel, setExpLevel] = useState<'junior' | 'all'>('junior');
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Direct portal external links
  const [directLinks, setDirectLinks] = useState({
    linkedin: 'https://id.linkedin.com/jobs/search/?keywords=software+engineer&location=Indonesia',
    jobstreet: 'https://id.jobstreet.com/id/job-search/software-engineer-jobs/',
    glints: 'https://glints.com/id/opportunities/jobs/explore?keyword=software+engineer&country=ID',
    kalibrr: 'https://www.kalibrr.com/job-board/te/software-engineer',
  });

  // Custom Job input state
  const [customJob, setCustomJob] = useState({
    jobTitle: '',
    company: '',
    location: 'Jakarta, Indonesia',
    recruiterEmail: '',
    jobUrl: '',
    jobDescription: '',
  });
  const [fetchingUrl, setFetchingUrl] = useState(false);

  // Tailoring state
  const [tailoring, setTailoring] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);

  // Active / Selected Application for CV Review Drawer
  const [activeApp, setActiveApp] = useState<TailoredApplication | null>(null);
  const [appModalTab, setAppModalTab] = useState<'cv' | 'email' | 'linkedin' | 'jd'>('cv');

  // History state
  const [history, setHistory] = useState<TailoredApplication[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tailored_cv_applications');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load application history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newApp: TailoredApplication) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newApp.id);
      const updated = [newApp, ...filtered];
      try {
        localStorage.setItem('tailored_cv_applications', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('tailored_cv_applications', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    if (activeApp?.id === id) {
      setActiveApp(null);
    }
  };

  const updateAppStatus = (
    id: string,
    status: 'Draft' | 'Approved' | 'Sent Email' | 'Applied LinkedIn' | 'Interviewing'
  ) => {
    setHistory((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        localStorage.setItem('tailored_cv_applications', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    if (activeApp && activeApp.id === id) {
      setActiveApp({ ...activeApp, status });
    }
  };

  // Fetch jobs from internal search API
  const fetchJobs = async (
    searchQuery = query,
    jobSource = source,
    jobLocation = location,
    jobExp = expLevel
  ) => {
    setLoadingJobs(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `/api/jobs/search?q=${encodeURIComponent(searchQuery)}&source=${jobSource}&location=${encodeURIComponent(
          jobLocation
        )}&exp=${jobExp}&limit=25`
      );
      const json = await res.json();
      if (json.success) {
        setJobs(json.data || []);
        if (json.meta?.directLinks) {
          setDirectLinks(json.meta.directLinks);
        }
      } else {
        setSearchError(json.error || 'Failed to fetch jobs.');
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Network error fetching jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs(query, source, location, expLevel);
  }, [source, location, expLevel]);

  // Handle Tailoring from a Job Card or Custom Form
  const handleTailorCV = async (params: {
    jobTitle: string;
    company: string;
    location?: string;
    jobDescription: string;
    jobUrl?: string;
    recruiterEmail?: string;
  }) => {
    setTailoring(true);
    setTailorError(null);

    try {
      const res = await fetch('/api/jobs/tailor-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to generate tailored Harvard CV.');
      }

      const tailoredData = json.data;
      const newApp: TailoredApplication = {
        id: `app-${Date.now()}`,
        jobTitle: params.jobTitle,
        company: params.company,
        location: params.location,
        jobUrl: params.jobUrl,
        recruiterEmail: params.recruiterEmail,
        matchScore: tailoredData.matchScore,
        matchSummary: tailoredData.matchSummary,
        strengths: tailoredData.strengths || [],
        keywordsToHighlight: tailoredData.keywordsToHighlight || [],
        harvardCv: tailoredData.harvardCv,
        emailPitch: tailoredData.emailPitch,
        linkedinPitch: tailoredData.linkedinPitch,
        originalDescription: params.jobDescription,
        status: 'Draft',
        createdAt: new Date().toISOString(),
      };

      saveToHistory(newApp);
      setActiveApp(newApp);
      setAppModalTab('cv');
    } catch (err) {
      setTailorError(err instanceof Error ? err.message : 'Error generating CV');
    } finally {
      setTailoring(false);
    }
  };

  // Auto-fetch details from a LinkedIn URL in Custom Form
  const handleAutoFetchUrl = async () => {
    if (!customJob.jobUrl || !customJob.jobUrl.includes('linkedin.com')) {
      alert('Silakan masukkan link lowongan LinkedIn yang valid (misal: https://id.linkedin.com/jobs/view/...)');
      return;
    }

    setFetchingUrl(true);
    try {
      const match = customJob.jobUrl.match(/-(\d{8,12})/);
      if (!match) throw new Error('Job ID tidak ditemukan di URL.');
      const jobId = match[1];

      const res = await fetch(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} dari LinkedIn`);
      const html = await res.text();

      const titleMatch = html.match(/<h2 class="top-card-layout__title[^"]*">([\s\S]*?)<\/h2>|<h1[^>]*>([\s\S]*?)<\/h1>/);
      const compMatch = html.match(/<a class="topcard__org-name-link[^"]*"[^>]*>([\s\S]*?)<\/a>/);
      const descMatch = html.match(/<div class="show-more-less-html__markup[^"]*">([\s\S]*?)<\/div>/);

      setCustomJob((prev) => ({
        ...prev,
        jobTitle: titleMatch
          ? (titleMatch[1] || titleMatch[2]).replace(/<[^>]*>/g, '').trim()
          : prev.jobTitle,
        company: compMatch ? compMatch[1].replace(/<[^>]*>/g, '').trim() : prev.company,
        jobDescription: descMatch
          ? descMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          : prev.jobDescription,
      }));
    } catch (err: any) {
      alert('Gagal mengambil otomatis: ' + err.message + '. Anda dapat menempelkan teks deskripsi secara manual.');
    } finally {
      setFetchingUrl(false);
    }
  };

  const copyToClipboard = async (text: string, sectionKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const fillCustomSample = () => {
    setCustomJob({
      jobTitle: 'Junior Software Engineer (Backend & Web / 1-3 Tahun)',
      company: 'GoTo / Grab Indonesia',
      location: 'Jakarta Selatan, Indonesia (Hybrid)',
      recruiterEmail: 'talent.tech@company.id',
      jobUrl: 'https://id.linkedin.com/jobs/view/4468726313',
      jobDescription: `Posisi: Junior Software Engineer (Level: Beginner / 1-3 Tahun Pengalaman)
Lokasi: Jakarta (Hybrid / Remote Indonesia)

Tanggung Jawab:
- Merancang, mengembangkan, dan memelihara backend microservices berkinerja tinggi menggunakan Go (Golang) atau Java.
- Membangun antarmuka web modern dengan React.js, Next.js, dan TypeScript.
- Membantu orkestrasi kontainer menggunakan Docker dan Kubernetes (GKE), serta memelihara alur CI/CD otomatis.
- Berkolaborasi dalam tim agile geo-distributed untuk mengoptimalkan latensi database PostgreSQL/MySQL dan integrasi message broker.

Kualifikasi:
- Lulusan S1 Informatika/Ilmu Komputer (Fresh Graduate atau pengalaman 1-3 tahun).
- Memiliki pemahaman kuat mengenai OOP, RESTful APIs, dan sistem terdistribusi.
- Nilai tambah: Pengalaman magang di perusahaan tech/BUMN dan familiar dengan GCP/Docker.`,
    });
  };

  const openCvTemplate = () => {
    const templateApp: TailoredApplication = {
      id: 'template-harvard-2page',
      jobTitle: 'Software Engineer (Full-Stack / Backend / Cloud)',
      company: 'Format Standar Harvard (CV 2 Lembar)',
      location: 'Jakarta, Indonesia',
      recruiterEmail: 'recruitment@company.id',
      matchScore: 98,
      matchSummary:
        'Format Resume Standar Harvard 2 Lembar resmi Nugroho Adi. Memuat Lengkap: Languages (Bahasa Indonesia & English), Organizational Experience (Digistar Club by Telkom Indonesia), Training & Certifications, Achievements, dan Technical/Soft Skills.',
      strengths: [
        'Languages: Bahasa Indonesia (Native), English',
        'Organizational Experience di Digistar Club by Telkom Indonesia',
        'Backend Microservices Java, Go & GCP di Telkom Indonesia',
        'Front-End Web React.js & Mobile Flutter',
      ],
      keywordsToHighlight: ['Golang', 'Java', 'React.js', 'Next.js', 'GCP', 'Docker', 'Kubernetes'],
      harvardCv: DEFAULT_HARVARD_CV_DATA,
      emailPitch: {
        subject: 'Application for Software Engineer - Nugroho Adi',
        body: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Software Engineer position. As an Informatics graduate from University of Muhammadiyah Malang with hands-on experience in backend microservices at Telkom Indonesia and modern web development, I am confident in delivering high-performance and scalable solutions.\n\nThank you for your consideration.\n\nBest regards,\nNugroho Adi\n+6281331620830 | deeforce112002@gmail.com\nhttps://nugroho-adi.me`,
      },
      linkedinPitch: {
        message: `Halo, saya Nugroho Adi. Saya melihat lowongan Software Engineer di perusahaan Anda dan sangat tertarik dengan tech stack yang digunakan. Senang bisa terhubung dan mendiskusikan bagaimana pengalaman saya dapat berkontribusi!`,
      },
      originalDescription: 'Template Resmi Harvard Resume (2 Lembar) - Nugroho Adi',
      status: 'Draft',
      createdAt: new Date().toISOString(),
    };

    setActiveApp(templateApp);
    setAppModalTab('cv');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Loker Indonesia & Harvard CV Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Cari Loker & Generator CV Harvard (Base Indonesia)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Cari lowongan kerja tech dari <strong>LinkedIn Indonesia</strong>, <strong>Jobstreet</strong>, <strong>Kalibrr</strong>, dan <strong>Glints</strong>. Buat CV ATS standar Harvard otomatis via AI, dan approve 1-klik via Email atau LinkedIn outreach.
          </p>
        </div>

        {/* Top Action & Navigation Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openCvTemplate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition shrink-0"
            title="Buka template CV Harvard 2 lembar asli Nugroho Adi untuk diprint atau disalin"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lihat CV Harvard (2 Lembar)</span>
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'browse'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cari Loker Indonesia</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'custom'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Loker / URL</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition relative ${
              activeTab === 'history'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Lamaran Disimpan</span>
            {history.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>

      {/* PORTAL SHORTCUTS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/20 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Direct Job Search Portals (Indonesia):</p>
            <p className="text-[11px] text-slate-400">Buka langsung lowongan terbaru di platform resmi dengan 1-klik:</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={directLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border border-sky-800/60 rounded-xl text-xs font-medium transition"
          >
            <LinkedInIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn ID</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <a
            href={directLinks.jobstreet}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/60 rounded-xl text-xs font-medium transition"
          >
            <Building className="w-3.5 h-3.5 text-purple-400" />
            <span>Jobstreet ID</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <a
            href={directLinks.glints}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-medium transition"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span>Glints ID</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          <a
            href={directLinks.kalibrr}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 rounded-xl text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kalibrr ID</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* TAB 1: BROWSE TECH JOBS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search Controls */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Keyword Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchJobs(query, source, location)}
                  placeholder="Cari posisi atau teknologi (e.g. Full Stack, Backend Go, React, Java, Flutter)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              {/* Location Select (Base di Indonesia) */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 shrink-0">
                <MapPin className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <select
                  value={location}
                  onChange={(e) => {
                    const newLoc = e.target.value;
                    setLocation(newLoc);
                    fetchJobs(query, source, newLoc, expLevel);
                  }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer py-1.5"
                >
                  {INDONESIA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                      {loc === 'Indonesia' ? '🇮🇩 Semua Indonesia' : `📍 ${loc}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level Selector (Beginner / Max 1-3 Tahun) */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 shrink-0">
                <span className="text-emerald-400 text-xs mr-1.5 shrink-0">🌱</span>
                <select
                  value={expLevel}
                  onChange={(e) => {
                    const newExp = e.target.value as any;
                    setExpLevel(newExp);
                    fetchJobs(query, source, location, newExp);
                  }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer py-1.5 font-medium"
                >
                  <option value="junior" className="bg-slate-900 text-slate-200">
                    🌱 Beginner / Max 1-3 Tahun (No Senior)
                  </option>
                  <option value="all" className="bg-slate-900 text-slate-200">
                    Semua Pengalaman
                  </option>
                </select>
              </div>

              {/* Source Switcher */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 shrink-0 overflow-x-auto">
                {INDONESIA_SOURCES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSource(s.id);
                      fetchJobs(query, s.id, location);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                      source === s.id
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Search Button */}
              <button
                onClick={() => fetchJobs(query, source, location)}
                disabled={loadingJobs}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition shadow-sm shrink-0"
              >
                {loadingJobs ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Cari Loker</span>
              </button>
            </div>

            {/* Keyword Quick Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <SlidersHorizontal className="w-3 h-3" /> Rekomendasi peran:
              </span>
              {PRESET_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setQuery(kw);
                    fetchJobs(kw, source, location);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition ${
                    query.toLowerCase() === kw.toLowerCase()
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingJobs && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">
                Mencari lowongan kerja tech di {location} ({source})...
              </p>
            </div>
          )}

          {searchError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {searchError}
            </div>
          )}

          {!loadingJobs && !searchError && jobs.length === 0 && (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">
                Tidak ada lowongan ditemukan untuk kata kunci &quot;{query}&quot; di {location}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan tab <strong>&quot;Paste Loker / URL&quot;</strong> untuk menempelkan lowongan langsung dari LinkedIn atau Jobstreet!
              </p>
            </div>
          )}

          {/* Job Feed Grid */}
          {!loadingJobs && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-emerald-950/20 group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                              job.source.includes('LinkedIn')
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : job.source.includes('Jobstreet')
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : job.source.includes('Kalibrr')
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {job.source}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            🌱 {job.experienceLevel || 'Beginner / 1-3 Thn'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition mt-1.5 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.company}</span>
                        </p>
                      </div>

                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka postingan asli lowongan"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 my-3">
                      <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{job.type}</span>
                      </span>
                      {job.salary && (
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 font-medium">
                          {job.salary}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.tags.slice(0, 5).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description preview snippet */}
                    <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-500">Diposting: {job.postedAt}</span>

                    <button
                      onClick={() =>
                        handleTailorCV({
                          jobTitle: job.title,
                          company: job.company,
                          location: job.location,
                          jobDescription: job.description,
                          jobUrl: job.url,
                        })
                      }
                      disabled={tailoring}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buat CV Harvard & Pitch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PASTE CUSTOM JOB DESCRIPTION */}
      {activeTab === 'custom' && (
        <div className="max-w-3xl bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Paste Lowongan Kerja (LinkedIn / Jobstreet / Glints)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tempel link atau teks deskripsi lowongan apa pun dari LinkedIn, Jobstreet, Glints, atau email recruiter.
              </p>
            </div>
            <button
              onClick={fillCustomSample}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              Isi Contoh Loker ID
            </button>
          </div>

          {/* Job URL with Auto-Fetch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Link Lowongan (LinkedIn / Jobstreet / Glints)
              </label>
              {customJob.jobUrl.includes('linkedin.com') && (
                <button
                  type="button"
                  onClick={handleAutoFetchUrl}
                  disabled={fetchingUrl}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${fetchingUrl ? 'animate-spin' : ''}`} />
                  <span>{fetchingUrl ? 'Mengambil detail...' : '⚡ Ambil Deskripsi Otomatis dari LinkedIn'}</span>
                </button>
              )}
            </div>
            <input
              type="url"
              placeholder="https://id.linkedin.com/jobs/view/... atau link Jobstreet"
              value={customJob.jobUrl}
              onChange={(e) => setCustomJob({ ...customJob, jobUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Posisi / Job Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                value={customJob.jobTitle}
                onChange={(e) => setCustomJob({ ...customJob, jobTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Perusahaan <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Gojek, Grab, Bank Mandiri, Traveloka"
                value={customJob.company}
                onChange={(e) => setCustomJob({ ...customJob, company: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lokasi Kerja (di Indonesia)
              </label>
              <input
                type="text"
                placeholder="e.g. Jakarta Selatan / Hybrid / Remote"
                value={customJob.location}
                onChange={(e) => setCustomJob({ ...customJob, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Recruiter / HR (Opsional untuk Send Email)
              </label>
              <input
                type="email"
                placeholder="e.g. careers@company.id"
                value={customJob.recruiterEmail}
                onChange={(e) => setCustomJob({ ...customJob, recruiterEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsi Pekerjaan & Kualifikasi / Syarat <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={8}
              placeholder="Tempel tanggung jawab, kualifikasi teknis (tech stack), dan persyaratan lowongan di sini..."
              value={customJob.jobDescription}
              onChange={(e) => setCustomJob({ ...customJob, jobDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() =>
                handleTailorCV({
                  jobTitle: customJob.jobTitle,
                  company: customJob.company,
                  location: customJob.location,
                  jobDescription: customJob.jobDescription,
                  jobUrl: customJob.jobUrl,
                  recruiterEmail: customJob.recruiterEmail,
                })
              }
              disabled={tailoring || !customJob.jobTitle || !customJob.jobDescription}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition shadow-md"
            >
              {tailoring ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{tailoring ? 'Menyesuaikan CV via Gemini AI...' : 'Buat CV Harvard & Pitch Lamaran'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
              <BookmarkCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">Belum ada lamaran tersimpan</p>
              <p className="text-xs text-slate-500 mt-1">
                Pilih lowongan kerja di tab &quot;Cari Loker Indonesia&quot; untuk membuat CV pertamamu!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setActiveApp(app);
                    setAppModalTab('cv');
                  }}
                  className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {app.matchScore}% ATS Match
                      </span>
                      <button
                        onClick={(e) => deleteFromHistory(app.id, e)}
                        title="Hapus lamaran"
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">{app.company}</p>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {app.matchSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        app.status === 'Approved'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : app.status === 'Sent Email'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : app.status === 'Applied LinkedIn'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'Interviewing'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {app.status}
                    </span>

                    <span className="text-emerald-400 font-medium text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      Review <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAILORING SPINNER OVERLAY */}
      {tailoring && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Menyesuaikan CV Standar Harvard</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Gemini AI sedang memetakan syarat lowongan dengan rekam jejak Nugroho di Telkom Indonesia, UMM (IPK 3.83), cloud microservices, dan keahlian teknis lainnya.
              </p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION DRAWER / MODAL */}
      {activeApp && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {activeApp.matchScore}% ATS Match
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400">{activeApp.company}</span>
                  {activeApp.location && (
                    <>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400">{activeApp.location}</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeApp.jobTitle}</h2>
              </div>

              {/* Status & Close */}
              <div className="flex items-center gap-2">
                <select
                  value={activeApp.status}
                  onChange={(e) => updateAppStatus(activeApp.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                  <option value="Sent Email">Sudah Kirim Email</option>
                  <option value="Applied LinkedIn">Applied on LinkedIn</option>
                  <option value="Interviewing">Interviewing</option>
                </select>

                <button
                  onClick={() => setActiveApp(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Sub-Tabs */}
            <div className="px-5 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setAppModalTab('cv')}
                className={`py-2.5 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition ${
                  appModalTab === 'cv'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Harvard Standard CV (2 Lembar)</span>
              </button>
              <button
                onClick={() => setAppModalTab('email')}
                className={`py-2.5 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition ${
                  appModalTab === 'email'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Pitch (Send Email)</span>
              </button>
              <button
                onClick={() => setAppModalTab('linkedin')}
                className={`py-2.5 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition ${
                  appModalTab === 'linkedin'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn Outreach</span>
              </button>
              <button
                onClick={() => setAppModalTab('jd')}
                className={`py-2.5 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition ${
                  appModalTab === 'jd'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Deskripsi Loker</span>
              </button>
            </div>

            {/* Modal Body Area */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/40">
              {/* SUBTAB: HARVARD CV */}
              {appModalTab === 'cv' && (
                <div className="space-y-6">
                  {/* Match Analysis Bar */}
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl">
                    <p className="text-xs text-emerald-300 font-medium leading-relaxed">
                      <span className="font-bold">Analisis Kecocokan:</span> {activeApp.matchSummary}
                    </p>
                    {activeApp.keywordsToHighlight && activeApp.keywordsToHighlight.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">Kata Kunci Ditekankan:</span>
                        {activeApp.keywordsToHighlight.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Harvard Resume Document Component */}
                  <HarvardResume
                    data={activeApp.harvardCv}
                    onChange={(updatedCv) => {
                      const updatedApp = { ...activeApp, harvardCv: updatedCv };
                      setActiveApp(updatedApp);
                      saveToHistory(updatedApp);
                    }}
                  />
                </div>
              )}

              {/* SUBTAB: EMAIL PITCH */}
              {appModalTab === 'email' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <Mail className="w-4 h-4 text-emerald-400" />
                        <span>Email Cover Letter & Pitch Pelamar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(activeApp.emailPitch.body, 'email-body')}
                          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                        >
                          {copiedSection === 'email-body' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedSection === 'email-body' ? 'Disalin!' : 'Salin Isi Email'}</span>
                        </button>

                        <a
                          href={`mailto:${activeApp.recruiterEmail || ''}?subject=${encodeURIComponent(
                            activeApp.emailPitch.subject
                          )}&body=${encodeURIComponent(activeApp.emailPitch.body)}`}
                          onClick={() => updateAppStatus(activeApp.id, 'Sent Email')}
                          className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-lg transition shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim via Mail App</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Email Recruiter / HR Perusahaan
                      </label>
                      <input
                        type="email"
                        value={activeApp.recruiterEmail || ''}
                        onChange={(e) => {
                          const updated = { ...activeApp, recruiterEmail: e.target.value };
                          setActiveApp(updated);
                          saveToHistory(updated);
                        }}
                        placeholder="e.g. recruitment@perusahaan.co.id"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Subjek Email
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={activeApp.emailPitch.subject}
                          onChange={(e) => {
                            const updated = {
                              ...activeApp,
                              emailPitch: { ...activeApp.emailPitch, subject: e.target.value },
                            };
                            setActiveApp(updated);
                            saveToHistory(updated);
                          }}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-medium"
                        />
                        <button
                          onClick={() => copyToClipboard(activeApp.emailPitch.subject, 'email-subj')}
                          className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 shrink-0"
                          title="Salin subjek"
                        >
                          {copiedSection === 'email-subj' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Isi Pesan / Cover Pitch
                      </label>
                      <textarea
                        rows={12}
                        value={activeApp.emailPitch.body}
                        onChange={(e) => {
                          const updated = {
                            ...activeApp,
                            emailPitch: { ...activeApp.emailPitch, body: e.target.value },
                          };
                          setActiveApp(updated);
                          saveToHistory(updated);
                        }}
                        className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB: LINKEDIN OUTREACH */}
              {appModalTab === 'linkedin' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <LinkedInIcon className="w-4 h-4 text-sky-400" />
                        <span>Pesan Singkat untuk Recruiter di LinkedIn</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeApp.linkedinPitch.message, 'li-msg')}
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                      >
                        {copiedSection === 'li-msg' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSection === 'li-msg' ? 'Disalin!' : 'Salin Pesan'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Kirimkan pesan personal ini saat menambahkan koneksi (*Add Note*) atau InMail ke Recruiter {activeApp.company} di LinkedIn.
                    </p>

                    <div>
                      <textarea
                        rows={6}
                        value={activeApp.linkedinPitch.message}
                        onChange={(e) => {
                          const updated = {
                            ...activeApp,
                            linkedinPitch: { message: e.target.value },
                          };
                          setActiveApp(updated);
                          saveToHistory(updated);
                        }}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 leading-relaxed"
                      />
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                        <span>Jumlah karakter: {activeApp.linkedinPitch.message.length}</span>
                        <span>Batas pesan koneksi LinkedIn: 300 karakter</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <a
                        href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
                          activeApp.company + ' recruiter talent acquisition indonesia'
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => updateAppStatus(activeApp.id, 'Applied LinkedIn')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl transition shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Cari Recruiter {activeApp.company} di LinkedIn</span>
                      </a>

                      {activeApp.jobUrl && (
                        <a
                          href={activeApp.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Halaman Lowongan</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB: ORIGINAL JOB DESCRIPTION */}
              {appModalTab === 'jd' && (
                <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white">Deskripsi Lowongan Asli</h3>
                    {activeApp.jobUrl && (
                      <a
                        href={activeApp.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Link Lowongan Asli</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {activeApp.originalDescription || 'Tidak ada deskripsi asli tersimpan.'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
