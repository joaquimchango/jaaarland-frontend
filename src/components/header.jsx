import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import Navbar from "./navbar";
import UserIcon from "./ui/userIcon";
import CartShoppingIcon from "./ui/shoppingIcon";

export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header className="header flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <div className="header__logo text-lg font-semibold tracking-wide">
        <Link to="/">Jaaarland</Link>
      </div>

      <div className="header__nav hidden md:block">
        <Navbar />
      </div>

      <div className="icons">
        <div className="flex items-center gap-2 rounded-full bg-black px-2 py-2 shadow-sm ring-1 ring-white/10">
          <Link
            to={isLoggedIn ? "/orders" : "/login"}
            aria-label="User account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
          >
            <UserIcon size={18} color="#ffffff" strokeWidth={2} />
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
          >
            <CartShoppingIcon size={18} color="#ffffff" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
}