export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080B12]">
      <div className="px-4 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white">
              A
            </div>
            <span className="text-lg font-bold text-white">AniVerse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your Universe of Anime. Streaming and downloads for authorized content only.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-8 border-t border-white/10 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AniVerse. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">DMCA</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
