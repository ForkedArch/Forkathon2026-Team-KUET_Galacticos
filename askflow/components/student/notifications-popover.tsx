'use client';

import React from 'react';
import { NotificationItem } from '@/lib/types';
import { Bell, CheckCheck, Clock } from 'lucide-react';

interface NotificationsPopoverProps {
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onClose: () => void;
}

export function NotificationsPopover({
  notifications,
  onNotificationClick,
  onClose,
}: NotificationsPopoverProps) {
  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-[var(--color-primary)]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Notifications
          </h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
          {notifications.length} Total
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 ${
                !notif.isRead ? 'bg-amber-50/40' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--color-primary)]">
                  Instructor Reply
                </span>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {notif.message}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
