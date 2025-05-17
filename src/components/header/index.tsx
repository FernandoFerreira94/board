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
  // session Verifica se tem usuario logado
  // status verifica o status "authenticated" , "unauthenticated" ou "loading"
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
      toast.success("Você esta logado");
      return;
    }
    if (status === "unauthenticated") {
      toast.error("Você foi deslogado");
    }
  }, [status]);

  return (
    <header className="w-full h-20  bg-[#0f0f0f]  ">
      <section className="flex items-center h-full justify-around  max-sm:justify-between max-sm:px-3">
        <nav className="flex items-center gap-8">
          <Link href="/">
            <span className="text-white text-4xl font-bold tracking-wider">
              Tarefas
            </span>
            <span className="text-red-600 font-bold text-3xl">+</span>
          </Link>
          {session?.user && (
            <Link
              className="text-black font-bold bg-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:scale-108  cursor-pointer"
              href="/dashboard"
            >
              {isMobile ? (
                <MdOutlineDashboardCustomize size={25} />
              ) : (
                "Meu painel"
              )}
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <>
            <AiOutlineLoading3Quarters
              className="animate-spin text-white"
              size={35}
            />
          </>
        ) : session ? (
          <>
            <div className="flex items-center gap-4">
              {!isMobile && (
                <span className="text-xl text-white">
                  Olá <strong>{session?.user?.name}</strong>
                </span>
              )}

              <button
                onClick={() => {
                  signOut();
                }}
                className="text-white mt-3 rounded-2xl  cursor-pointer"
              >
                {" "}
                {isMobile ? (
                  <Image
                    src={session?.user?.image || "/avatar.svg"}
                    alt="foto perfil"
                    className="rounded-full transition duration-500 hover:scale-110"
                    width={60}
                    height={60}
                  />
                ) : (
                  <Image
                    src={session?.user?.image || "/avatar.svg"}
                    alt="foto perfil"
                    className="rounded-full transition duration-500 hover:scale-110"
                    width={60}
                    height={60}
                  />
                )}
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => {
              signIn("google");
            }}
            className="text-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:bg-white hover:text-black  cursor-pointer"
          >
            {isMobile ? <FaRegUser size={25} /> : "Acessar minha conta"}
          </button>
        )}
      </section>
    </header>
  );
}
