import Link from 'next/link';
import ShaderBackground from "@/components/ui/shader-background";
import VectoraApp from "@/components/vectora-app";

export default function ConvertPage() {
  return (
    <>
      <ShaderBackground />
      <main className="relative z-10 h-screen overflow-hidden flex items-center justify-center px-4 py-8">
        <Link
          href="/"
          className="fixed left-6 top-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <VectoraApp />
      </main>
    </>
  );
}