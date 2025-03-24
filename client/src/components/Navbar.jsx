import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import DepartmentModal from "./DepartmentModal";

import { IoMenuSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [clerkId, setClerkId] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      setMenuHeight("180px"); // adjust as needed
      document.body.style.overflow = "hidden";
    } else {
      setMenuHeight("0px");
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const registerUser = async () => {
      if (!user) return;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/register`,
          {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress.emailAddress,
          }
        );
        setClerkId(user.id);
        if (!res.data.department) setShowModal(true);
      } catch (error) {
        console.error("Käyttäjän rekisteröinti epäonnistui:", error);
      }
    };
    registerUser();
  }, [user]);

  return (
    <>
      {showModal && clerkId && (
        <DepartmentModal
          clerkId={clerkId}
          onDepartmentSaved={() => setShowModal(false)}
        />
      )}

      <nav className="bg-black text-white w-full fixed top-0 left-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[80px] flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-6">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <IoMdClose size={30} />
                  ) : (
                    <IoMenuSharp size={30} />
                  )}
                </button>
              </div>

              {/* Desktop links */}
              <div className="hidden md:flex gap-6">
                <Link
                  to="/leaderboard"
                  className="hover:text-blue-400 transition"
                >
                  Leaderboard
                </Link>
                <Link to="/add" className="hover:text-blue-400 transition">
                  Lisää kilometrit
                </Link>
                <Link to="/my" className="hover:text-blue-400 transition">
                  Omat merkinnät
                </Link>
              </div>
            </div>

            {/* CENTER */}
            <div className="text-4xl font-bold tracking-wide">LIIKU</div>

            {/* RIGHT - auth buttons */}
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm">
                    Rekisteröidy
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm">
                    Kirjaudu
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN - height-animated */}
        <div
          style={{
            height: menuHeight,
            transition: "height 300ms ease-in-out",
            overflow: "hidden",
          }}
          className="md:hidden  text-white shadow-xl"
        >
          <ul className="flex flex-col text-2xl  items-center justify-center py-4 space-y-4 font-semibold">
            <li>
              <Link to="/leaderboard" onClick={toggleMenu}>
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/add" onClick={toggleMenu}>
                Lisää kilometrit
              </Link>
            </li>
            <li>
              <Link to="/my" onClick={toggleMenu}>
                Omat merkinnät
              </Link>
            </li>
            <li></li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
