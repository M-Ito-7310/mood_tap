'use client';

export function MoodSuccessToast() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-sm">
        <span className="text-2xl animate-bounce">✅</span>
        <span className="font-medium">記録しました!</span>
      </div>
    </div>
  );
}
