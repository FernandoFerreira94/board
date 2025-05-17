"use client";

import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin7Line, RiShareForwardFill } from "react-icons/ri";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import TextArea from "@/components/textarea";
import { db } from "@/firebaseConect/firebase";

interface TaskProps {
  id: string;
  checkbox: boolean;
  text: string;
}

export default function DashboardClient({ session }: any) {
  const [textArea, setTextArea] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [listTask, setListatask] = useState<TaskProps[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const email = session?.user?.email;

  const getFirebase = useCallback(async () => {
    const postRef = collection(db, "listTask");
    try {
      const snapshot = await getDocs(postRef);
      const lista: TaskProps[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          text: doc.data().text,
          checkbox: doc.data().checkbox,
        });
      });

      setListatask(lista);
      saveTaskLocalStorage(email, lista);
    } catch (error) {
      console.error("Erro ao buscar tasks do Firebase", error);
    }
  }, [email]);

  useEffect(() => {
    getFirebase();
  }, [hasLoaded, getFirebase]);

  useEffect(() => {
    if (!email) return;

    getFirebase();
    const saveTask = getTaskLocalStortage(email);
    if (saveTask.length > 0) {
      setListatask(saveTask);
    }
    setHasLoaded(true);
  }, [email, getFirebase]);

  function saveTaskLocalStorage(email: string, list: TaskProps[]) {
    localStorage.setItem(email, JSON.stringify(list));
  }

  function getTaskLocalStortage(email: string): TaskProps[] {
    const data = localStorage.getItem(email);
    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error ao ler localStorage", error);
      return [];
    }
  }

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
      checkbox,
    })
      .then((docRef) => {
        const newTask: TaskProps = {
          id: docRef.id,
          text: textArea,
          checkbox,
        };
        console.log(docRef.id);
        setListatask((prev) => [...prev, newTask]);
        setTextArea("");
        setCheckbox(false);
        toast.success("Task save success");
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
        toast.success("task deleted successfully");
      })
      .catch((error) => {
        toast.error("Oops can't delete the task");
        console.error(error);
      });
    getFirebase();
  }

  return (
    <div className="bg-[#0f0f0f] w-full flex items-center flex-col heigth">
      <main className="w-full flex flex-col items-center border">
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
                <div className="flex flex-col gap-2">
                  {task.checkbox && (
                    <div className="flex gap-3 items-center">
                      <span className="bg-blue-500 text-white py-1.5 px-5 rounded-md text-sm cursor-pointer transition duration-500 hover:scale-110">
                        Public
                      </span>
                      <RiShareForwardFill
                        size={30}
                        className="text-blue-500 cursor-pointer transition duration-500 hover:scale-120"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xl">{task.text}</span>
                  </div>
                </div>
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
