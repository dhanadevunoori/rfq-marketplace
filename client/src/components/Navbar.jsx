import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-slate-900"
        >
          RFQ Marketplace
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="hidden text-sm text-slate-600 sm:block">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;