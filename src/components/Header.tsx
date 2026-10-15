'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Database, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'Portfolio content & analytics summary' },
  '/projects': { title: 'Projects Manager', subtitle: 'Manage portfolio case studies & builds' },
  '/experiences': { title: 'Timeline & Experience', subtitle: 'Manage 24-column timeline milestones' },
  '/achievements': { title: 'Achievements & Awards', subtitle: 'Manage certifications & highlights' },
  '/skills': { title: 'Skills & Toolkit', subtitle: 'Manage technical competencies & categories' },
  '/messages': { title: 'Contact Inquiries', subtitle: 'Manage contact form messages & replies' },
  '/profile': { title: 'Profile & Settings', subtitle: 'Manage personal bio, hero copy & links' },
};

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const current = titles[pathname] || {
    title: 'Content Manager',
    subtitle: 'Nugroho Adi Portfolio CMS',
  };

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          {current.title}
        </h2>
        <p className="text-[11px] text-slate-400">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[11px] text-emerald-400 font-medium">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>API Online (:5000)</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full text-[11px] text-slate-300">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Neon PostgreSQL</span>
        </div>
      </div>
    </header>
  );
}
