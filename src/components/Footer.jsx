const Footer = () => {
  return (
    <footer className="w-full mt-10 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold opacity-60">Made by</span>
        <a
          href="https://portfolio-vedant-gour.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-indigo-500 hover:underline"
        >
          Vedant Gour
        </a>
      </div>
    </footer>
  );
};

export default Footer;
