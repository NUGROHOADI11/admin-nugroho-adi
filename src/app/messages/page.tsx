'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Mail,
  Trash2,
  X,
  CheckCircle,
  Clock,
  Archive,
  Send,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  replyNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Reader Modal State
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyNote, setReplyNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await api.messages.getAll({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: search || undefined,
      });
      setMessages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter, search]);

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    setReplyNote(msg.replyNote || '');

    // Auto mark as READ if UNREAD
    if (msg.status === 'UNREAD') {
      handleUpdateStatus(msg.id, 'READ', msg.replyNote);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: string,
    note?: string | null,
  ) => {
    try {
      setUpdating(true);
      const updated = await api.messages.update(id, {
        status: newStatus,
        replyNote: note !== undefined ? note : replyNote,
      });

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }

      await loadMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to update message status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveReplyNote = async () => {
    if (!selectedMessage) return;
    await handleUpdateStatus(
      selectedMessage.id,
      selectedMessage.status,
      replyNote,
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete message from: "${name}"?`))
      return;

    try {
      await api.messages.delete(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      await loadMessages();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Client Inquiries & Messages ({messages.length})
          </h2>
          <p className="text-xs text-slate-400">
            Incoming contact form leads and collaboration inquiries
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name or keyword..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {['ALL', 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              statusFilter === status
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No messages found under &quot;{statusFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Sender Details</th>
                  <th className="py-3.5 px-6 font-semibold">Classification</th>
                  <th className="py-3.5 px-6 font-semibold">Message Preview</th>
                  <th className="py-3.5 px-6 font-semibold">Date Received</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-medium text-white max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {msg.name}
                        </span>
                        {msg.status === 'UNREAD' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {msg.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-700/60">
                        {msg.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-300">
                      {msg.message}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          msg.status === 'UNREAD'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : msg.status === 'REPLIED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : msg.status === 'ARCHIVED'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id, msg.name);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Reader Drawer / Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Inquiry Details</h3>
                  <p className="text-[10px] text-slate-400">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Sender card */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Sender Information
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {selectedMessage.name}
                  </h4>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your Inquiry`}
                    className="text-xs text-emerald-400 hover:underline mt-0.5 inline-block"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold uppercase">
                    {selectedMessage.subject}
                  </span>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-3 py-1 rounded-lg text-xs inline-flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </a>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Message Content
                </label>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Switcher & Reply Note */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Update Message Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={updating}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedMessage.id,
                              st,
                              selectedMessage.replyNote,
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                            selectedMessage.status === st
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Internal Reply Notes / Follow-up Record
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyNote}
                      onChange={(e) => setReplyNote(e.target.value)}
                      placeholder="e.g. Discussed proposal via WhatsApp, agreed on project scope."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveReplyNote}
                      disabled={updating}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition shrink-0"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(selectedMessage.id, selectedMessage.name)
                  }
                  className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Message
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
