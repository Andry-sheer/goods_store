import { Link, NavLink } from "react-router";
import { NAVLINK } from "../../constants/constants.nav";

export const Header = ({ user }) => {
  return (
    <header className="w-full pt-5">
      <div className="max-w-7xl bg-white rounded-3xl shadow-md mx-auto flex items-center justify-between p-4">
        <Link to="/" className="w-14 h-14 block">
          <img
            className="object-cover w-full h-full rounded-full"
            src="/logo.svg"
            alt="Logo"
          />
        </Link>

        <nav className="space-x-6">
          {NAVLINK.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({
                isActive,
              }) => `font-medium transition-colors duration-500 
                    ${isActive ? "text-green-600 font-semibold" : "hover:text-green-600"}`}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* user image (future) */}
        <Link to="/profile" className="flex items-center justify-between gap-2">
          <span className="text-base">{user.name}</span>
          <div className="w-16 h-16 rounded-full border-2 border-green-600 overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={user.image}
              alt={user.name}
            />
          </div>
        </Link>
      </div>
    </header>
  );
};
