"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { RiDeleteBin7Line, RiShareLine } from "react-icons/ri";
import {
  query,
  orderBy,
  where,
  onSnapshot,
  collection,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import TextArea from "@/components/textarea";
import { db } from "@/service/firebase";

interface TaskProps {
  id: string;
  public: boolean;
  text: string;
  user: string;
  created: Date;
}

interface SessionProps {
  session: {
    user: {
      email: string;
    };
  };
}

export default function DashboardClient({ session }: SessionProps) {
  const [textArea, setTextArea] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [listTask, setListatask] = useState<TaskProps[]>([]);
  const email = session?.user?.email;

  useEffect(() => {
    async function getFireBaseTask() {
      const taskRef = collection(db, "listTask");
      const q = query(
        taskRef,
        orderBy("created", "desc"),
        where("user", "==", email)
      );

      onSnapshot(q, (snapshot) => {
        const lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            text: doc.data().text,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setListatask(lista);
      });
    }

    getFireBaseTask();
  }, [email]);

  async function handleAddTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedText = textArea.trim().toLowerCase();

    const isDuplicate = listTask.some(
      (task) => task.text.trim().toLowerCase() === normalizedText
    );

    if (isDuplicate) {
      toast.error("Essa tarefa ja existe");
      return;
    }

    await addDoc(collection(db, "listTask"), {
      text: textArea,
      public: checkbox,
      user: email,
      created: new Date(),
    })
      .then(() => {
        toast.success("Task add with success!");
        setTextArea("");
        setCheckbox(false);
      })
      .catch((error) => {
        toast.error("Error save your task :(");
        console.error(error);
      });
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "listTask", id);
    await deleteDoc(docRef)
      .then(() => {
        toast.info("task deleted successfully");
      })
      .catch((error) => {
        toast.error("Oops can't delete the task");
        console.error(error);
      });
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task${id}`
    );
    alert("URL compiada");
  }

  return (
    <div className="bg-[#0f0f0f] w-full flex items-center flex-col heigth">
      <main className="w-full flex flex-col items-center">
        <section className="w-7/10 max-sm:w-9/10 mt-20">
          <form
            onSubmit={handleAddTask}
            className="w-full flex flex-col gap-5 text-white"
          >
            <h1 className="text-4xl font-bold">What&apos;s your task?</h1>
            <TextArea
              placeholder="Type your task"
              value={textArea}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTextArea(e.target.value)
              }
              required
            />
            <label className="flex items-center gap-3 text-xl cursor-pointer">
              <input
                type="checkbox"
                checked={checkbox}
                onChange={() => setCheckbox(!checkbox)}
                className="hidden peer"
              />
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
              Make task public
            </label>
            <input
              type="submit"
              value="Register"
              className="bg-blue-500 rounded-md h-13 text-xl cursor-pointer transition duration-500 hover:scale-102"
            />
          </form>
        </section>
        <div className="bg-white w-full mt-10 flex flex-col items-center pb-40">
          <h1 className="mt-15 text-4xl font-bold">My tasks</h1>
          {listTask.length > 0 ? (
            listTask.map((task, index) => (
              <section
                key={index}
                className="w-7/10 mt-7 flex justify-between items-center gap-5 max-sm:w-9/10 rounded-md p-3 border-2 transition duration-200 hover:border-blue-500"
              >
                <article className="flex flex-col gap-2 w-full">
                  {task.public && (
                    <div className="flex gap-3 items-center">
                      <span className="bg-blue-500 text-white py-1.5 px-5 rounded-md text-sm cursor-pointer transition duration-500 hover:scale-110">
                        Public
                      </span>
                      <button
                        onClick={() => handleShare(task.id)}
                        className="text-blue-500 cursor-pointer transition duration-500 hover:scale-120"
                      >
                        <RiShareLine size={30} />
                      </button>
                    </div>
                  )}
                  <Link href={`/task/${task.id}`} className="w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-xl whitespace-pre w-full">
                        {task.text}
                      </p>
                    </div>
                  </Link>
                </article>
                <RiDeleteBin7Line
                  size={35}
                  color="red"
                  className="transition duration-500 hover:scale-115 cursor-pointer"
                  onClick={() => {
                    handleDeleteTask(task.id);
                  }}
                />
              </section>
            ))
          ) : (
            <h1 className="mt-10 text-xl font-bold text-red-500">
              You have no task
            </h1>
          )}
        </div>
      </main>
    </div>
  );
}
