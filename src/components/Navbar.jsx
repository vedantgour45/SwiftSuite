import { useDispatch, useSelector } from "react-redux";
import { logo } from "../assets";
import { toggleDarkMode } from "../services/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <nav className="flex justify-between items-center w-full mb-10 pt-6">
      <div className="flex items-center gap-2">
        <span className="font-satoshi font-bold text-xl tracking-wide">
          Swift<span className="blue_gradient">Suite</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => dispatch(toggleDarkMode())}
          className="icon_btn"
          aria-label="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          type="button"
          onClick={() =>
            window.open("https://github.com/vedantgour45", "_blank")
          }
          className="btn_primary !py-2 !px-4 text-sm"
        >
          GitHub
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
