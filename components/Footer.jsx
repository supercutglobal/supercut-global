export function Footer() {
  return (
    <footer className="bg-[#081638] border-t border-white/10 text-white">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left text-[11px] sm:text-[12px] text-white/50">
        <span>© {new Date().getFullYear()} SUPER CUT Hardface Solutions. All rights reserved.</span>
        <span>ISO 9001:2015 • UAE — UK — USA</span>
      </div>
    </footer>
  );
}
