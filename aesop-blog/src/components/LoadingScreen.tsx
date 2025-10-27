export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        <h1 className="mt-4 text-3xl font-bold text-white">Aesop Blog</h1>
        <p className="mt-2 text-white/80">Loading...</p>
      </div>
    </div>
  );
}
