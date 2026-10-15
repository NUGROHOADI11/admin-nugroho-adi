'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Milestone,
  Award,
  Wrench,
  Mail,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    achievements: 0,
    skills: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [projects, experiences, achievements, skills, messages] =
        await Promise.all([
          api.projects.getAll().catch(() => []),
          api.experiences.getAll().catch(() => []),
          api.achievements.getAll().catch(() => []),
          api.skills.getAll().catch(() => []),
          api.messages.getAll().catch(() => []),
        ]);

      const unread = messages.filter((m: any) => m.status === 'UNREAD').length;

      setStats({
        projects: projects.length,
        experiences: experiences.length,
        achievements: achievements.length,
        skills: skills.length,
        totalMessages: messages.length,
        unreadMessages: unread,
      });

      setRecentMessages(messages.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.messages.update(id, { status: 'READ' });
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-linear-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">
            Welcome to Portfolio CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Manage your digital footprint with ease.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Easily update case studies, timeline milestones, skills, and manage
            inbound client inquiries from one central control panel.
          </p>
        </div>

        <div className="relative z-10 flex gap-3 shrink-0">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects */}
        <Link
          href="/projects"
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Total Projects</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {stats.projects}
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5 transition">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Timeline */}
        <Link
          href="/experiences"
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Timeline Items</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Milestone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {stats.experiences}
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5 transition">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Achievements */}
        <Link
          href="/achievements"
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Achievements</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {stats.achievements}
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5 transition">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Inquiries */}
        <Link
          href="/messages"
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Inbound Messages</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {stats.totalMessages}
              </span>
              {stats.unreadMessages > 0 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  {stats.unreadMessages} New
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 flex items-center gap-0.5 transition">
              Inbox <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/projects"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 flex items-center gap-3 transition"
        >
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Add Project</p>
            <p className="text-[10px] text-slate-400">New case study</p>
          </div>
        </Link>

        <Link
          href="/experiences"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 flex items-center gap-3 transition"
        >
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Add Timeline</p>
            <p className="text-[10px] text-slate-400">Milestone entry</p>
          </div>
        </Link>

        <Link
          href="/skills"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 flex items-center gap-3 transition"
        >
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Tech Toolkit</p>
            <p className="text-[10px] text-slate-400">{stats.skills} skills</p>
          </div>
        </Link>

        <Link
          href="/profile"
          className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 flex items-center gap-3 transition"
        >
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Edit Profile</p>
            <p className="text-[10px] text-slate-400">Bio, status, quote</p>
          </div>
        </Link>
      </div>

      {/* Recent Messages Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Inquiries
            </h3>
            <p className="text-xs text-slate-400">
              Messages submitted from the website contact form
            </p>
          </div>
          <Link
            href="/messages"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View All ({stats.totalMessages})
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No messages received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Sender</th>
                  <th className="pb-3 font-semibold">Subject / Tag</th>
                  <th className="pb-3 font-semibold">Message Preview</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 font-medium text-white">
                      <div>{msg.name}</div>
                      <div className="text-[10px] text-slate-400">{msg.email}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase">
                        {msg.subject}
                      </span>
                    </td>
                    <td className="py-3.5 max-w-xs truncate text-slate-400">
                      {msg.message}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          msg.status === 'UNREAD'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : msg.status === 'REPLIED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {msg.status === 'UNREAD' ? (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px]"
                        >
                          <CheckCircle className="w-3 h-3" /> Mark Read
                        </button>
                      ) : (
                        <Link
                          href="/messages"
                          className="text-slate-400 hover:text-white"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
