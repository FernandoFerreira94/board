import Link from "next/link";

export default function Header() {
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
          <Link
            className="text-black font-bold bg-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:scale-108  cursor-pointer"
            href="/dashboard"
          >
            Meu painel
          </Link>
        </nav>

        <button className="text-white border py-1.5 px-8 rounded-2xl transition duration-500 hover:bg-white hover:text-black  cursor-pointer">
          Minha conta
        </button>
      </section>
    </header>
  );
}
