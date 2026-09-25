export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-6 md:px-16 max-w-7xl mx-auto relative z-10 py-10 footer-block">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
        <span>
          © <span id="year">{year}</span> Youssef Sabbahy. All rights reserved.
        </span>
        <span>Built with React, Tailwind CSS &amp; a lot of easing curves.</span>
      </div>
    </footer>
  );
}
