export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background-light">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          MoodTap
        </h1>
        <p className="text-xl text-gray-600">
          たった3秒で、心の健康を可視化する
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <div className="w-16 h-16 rounded-full bg-mood-veryBad flex items-center justify-center text-2xl">
            😢
          </div>
          <div className="w-16 h-16 rounded-full bg-mood-bad flex items-center justify-center text-2xl">
            😟
          </div>
          <div className="w-16 h-16 rounded-full bg-mood-neutral flex items-center justify-center text-2xl">
            😐
          </div>
          <div className="w-16 h-16 rounded-full bg-mood-good flex items-center justify-center text-2xl">
            😊
          </div>
          <div className="w-16 h-16 rounded-full bg-mood-veryGood flex items-center justify-center text-2xl">
            😄
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Phase 1: プロジェクトセットアップ完了
        </p>
      </div>
    </main>
  );
}
