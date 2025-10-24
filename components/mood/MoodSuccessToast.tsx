'use client';

export function MoodSuccessToast() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <span className="font-medium">記録しました!</span>
      </div>
    </div>
  );
}
