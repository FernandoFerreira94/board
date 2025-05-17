"use client";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      toast.success(`Welcome ${session?.user?.name || "Guest"}`, {
        id: "auth-success",
      });
    }
    if (status === "unauthenticated") {
      toast.error("See you later", { id: "auth-error" });
    }
  }, [status, session?.user?.name]);

  return (
    <header className="w-full flex justify-center h-20 bg-[#0f0f0f]">
      <section className=" w-7/10 flex items-center h-full justify-between max-sm:justify-between max-sm:w-9/10">
        <nav className="flex items-center gap-8">
          <Link href="/">
            <span className="text-white text-4xl font-bold tracking-wider">
              Tasks
            </span>
            <span className="text-red-600 font-bold text-3xl">+</span>
          </Link>
          {session?.user && (
            <Link
              className="text-black font-bold bg-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:scale-108 cursor-pointer"
              href="/dashboard"
            >
              {isMobile ? (
                <MdOutlineDashboardCustomize size={25} />
              ) : (
                "My Dashboard"
              )}
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <AiOutlineLoading3Quarters
            className="animate-spin text-white"
            size={35}
          />
        ) : session ? (
          <div className="flex items-center gap-4">
            {!isMobile && (
              <span className="text-xl text-white">
                Hello <strong>{session?.user?.name}</strong>
              </span>
            )}
            <button
              onClick={() => signOut()}
              className="text-white mt-3 rounded-2xl cursor-pointer"
              aria-label="Sign out"
            >
              <Image
                src={session?.user?.image || "/avatar.svg"}
                alt="Profile picture"
                className="rounded-full transition duration-500 hover:scale-110"
                width={60}
                height={60}
              />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="text-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:bg-white hover:text-black cursor-pointer"
          >
            {isMobile ? <FaRegUser size={25} /> : "Sign in with Google"}
          </button>
        )}
      </section>
    </header>
  );
}
