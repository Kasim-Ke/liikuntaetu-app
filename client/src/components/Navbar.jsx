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

const Navbar = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [clerkId, setClerkId] = useState(null);

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

        // Näytä modal vain jos department puuttuu
        if (!res.data.department) {
          setShowModal(true);
        }
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

      <nav className="bg-black text-white w-full h-[80px] flex items-center justify-between px-6 shadow-md">
        <div className="flex gap-6">
          <Link
            to="/leaderboard"
            className="text-gray-300 hover:text-white duration-300"
          >
            Leaderboard
          </Link>
          <Link
            to="/add"
            className="text-gray-300 hover:text-white duration-300"
          >
            Lisää kilometrit
          </Link>
          <Link
            to="/my"
            className="text-gray-300 hover:text-white duration-300"
          >
            Omat merkinnät
          </Link>
        </div>

        <div className="flex gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Rekisteröidy
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition">
                Kirjaudu sisään
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
