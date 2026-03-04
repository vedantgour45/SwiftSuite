const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <h1 className="head_text">
        Modernize Your Workflow <br className="max-md:hidden" />
        <span className="orange_gradient">With SwiftSuite Tools</span>
      </h1>
      <h2 className="desc">
        All the essential productivity tools you need in one place. Summarize,
        check, translate, and generate with a single click. 100% free and
        open-source.
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <div className="glass_card px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
          🚀 8 Pro Tools
        </div>
        <div className="glass_card px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          ✨ 100% Free
        </div>
        <div className="glass_card px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
          🛡️ No Signup
        </div>
      </div>
    </header>
  );
};

export default Hero;
