'use client';

import { MoodCalendar } from '@/components/calendar/MoodCalendar';

export function CalendarClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">カレンダー</h1>
          <p className="text-gray-600">あなたの気分の波を可視化</p>
        </header>

        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <MoodCalendar />
        </section>
      </div>
    </div>
  );
}
