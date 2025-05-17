import Image from "next/image";
import Hero from "../../public/assets/hero.png";

export default function Home() {
  return (
    <div className="bg-[#0f0f0f] w-full flex justify-center items-center flex-col heigth">
      <main>
        <div className="flex flex-col items-center justify-center">
          <Image
            className="max-w-120 object-contain w-auto h-auto max-sm:max-w-8/10"
            alt="Tasks+ Logo"
            src={Hero}
            priority
          />
        </div>

        <h1 className="text-white text-center m-7 leading-relaxed text-3xl max-sm:text-2xl">
          A system made to help you organize <br /> your studies and tasks
        </h1>

        <div className="flex items-center justify-around max-sm:flex-col max-sm:gap-6">
          <section className="text-md bg-[#fafafa] py-3.5 px-11 rounded transition duration-300 hover:scale-108 cursor-pointer max-sm:w-8/10 max-sm:text-center">
            <span>+ 12 posts</span>
          </section>
          <section className="text-md bg-[#fafafa] py-3.5 px-11 rounded transition duration-300 hover:scale-108 cursor-pointer max-sm:w-8/10 max-sm:text-center">
            <span>+ 90 comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
