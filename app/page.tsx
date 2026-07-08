import Link from 'next/link';
import ShaderBackground from "@/components/ui/shader-background";

export default function Home() {
  return (
    <>
      <ShaderBackground />
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <img src="/Vectora-Negro.svg" alt="Vectora" className="w-96 h-auto" />
        <p className="mt-6 text-zinc-500 font-mono text-xs tracking-[0.3em] uppercase">
          SVG &rarr; Platform Assets
        </p>
        <Link
          href="/convert"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          Convert Assets
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </section>
    </>
  );
}