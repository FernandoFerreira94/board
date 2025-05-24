"use client";
import Image from "next/image";
import { getDocs, collection } from "firebase/firestore";

import Hero from "../../public/assets/hero.png";
import { db } from "@/service/firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const [post, setPost] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    async function getPost() {
      await getDocs(collection(db, "listTask")).then((snapshot) =>
        setPost(snapshot.size)
      );
    }

    getPost();
  }, [post]);

  useEffect(() => {
    async function getComment() {
      await getDocs(collection(db, "comments")).then((snapshot) =>
        setComments(snapshot.size)
      );
    }
    getComment();
  }, [comments]);
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
            <span>{post !== 0 ? `+ ${post} posts` : "No post"}</span>
          </section>
          <section className="text-md bg-[#fafafa] py-3.5 px-11 rounded transition duration-300 hover:scale-108 cursor-pointer max-sm:w-8/10 max-sm:text-center">
            <span>
              {comments !== 0 ? `+ ${comments} posts` : "No comments"}
            </span>
          </section>
        </div>
      </main>
    </div>
  );
}
