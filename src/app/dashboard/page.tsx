// app/dashboard/page.tsx
import { getAuthSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { RiDeleteBin7Line } from "react-icons/ri";
export default async function Dashboard() {
  const session = await getAuthSession();

  if (!session?.user) redirect("/");

  return (
    <div className="bg-[#0f0f0f] w-full flex items-center flex-col heigth">
      <main className="w-full border-amber-500 flex flex-col items-center">
        <form className="mt-25 w-7/10 text-white flex flex-col gap-6">
          <h1 className="text-white text-4xl font-bold">Qual sua tarefa?</h1>
          <textarea
            name="tarefa"
            id="tarefa"
            rows={7}
            className="bg-white w-full rounded-xl mt-5 p-4 text-xl text-black"
            placeholder="Digite sua tarefa..."
          />{" "}
          <label className="flex items-center gap-3 text-white text-xl cursor-pointer">
            <input type="checkbox" className="hidden peer" />
            <div className="w-7 h-7 border-3 border-white rounded-md flex items-center justify-center peer-checked:bg-white">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            Deixar tarefa pública
          </label>
          <input
            type="button"
            value="Registrar"
            className="bg-blue-500 rounded-md h-13 text-xl cursor-pointer transition duration-500 hover:scale-102"
          />
        </form>
        <div className="bg-white w-full mt-10 flex flex-col items-center pb-40 ">
          <h1 className="mt-15 text-4xl font-bold">Minhas tarefas</h1>
          <section className="w-7/10 mt-7 flex  flex-col gap-5 ">
            <div className="border p-5 rounded-md flex justify-between items-center">
              <span className="text-xl">texto</span>{" "}
              <RiDeleteBin7Line size={30} color="red" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
