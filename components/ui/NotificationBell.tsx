'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

const TYPE_ICONS: Record<string, string> = {
  trip_reminder: '✈️',
  visa_reminder: '📋',
  passport_expiry: '🛂',
  booking_reminder: '🔖',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (markRead = false) => {
    try {
      const res = await fetch(`/api/notifications${markRead ? '?markRead=true' : ''}`);
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnread(markRead ? 0 : (data.unreadCount ?? 0));
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open && unread > 0) fetchNotifications(true);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen}
        className="relative w-9 h-9 rounded-xl bg-white/8 text-white/60 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all">
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 bg-[#141929] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <p className="text-white font-medium text-sm">Notifications</p>
              {unread > 0 && (
                <button onClick={() => fetchNotifications(true)}
                  className="text-amber-400/70 text-xs hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Check size={11} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id}
                    className={cn('px-4 py-3 border-b border-white/5 hover:bg-white/4 transition-colors',
                      !n.is_read && 'bg-amber-500/4')}>
                    <div className="flex gap-3">
                      <span className="text-base shrink-0 mt-0.5">{TYPE_ICONS[n.type] ?? '🔔'}</span>
                      <div className="min-w-0">
                        <p className={cn('text-sm font-medium truncate', n.is_read ? 'text-white/60' : 'text-white')}>
                          {n.title}
                        </p>
                        <p className="text-white/40 text-xs leading-relaxed mt-0.5 line-clamp-2">{n.body}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-white/30 text-xs">{timeAgo(n.created_at)}</p>
                          {n.action_url && (
                            <Link href={n.action_url} onClick={() => setOpen(false)}
                              className="text-amber-400/70 text-xs hover:text-amber-400 transition-colors flex items-center gap-0.5">
                              View <ExternalLink size={9} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
