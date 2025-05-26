"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { RiDeleteBin7Line } from "react-icons/ri";

import { db } from "@/service/firebase";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import TextArea from "@/components/textarea";

interface TaskProps {
  text: string;
  id: string;
  created: Date;
  public: boolean;
  user: string;
}
interface TaskClientProps {
  id: string;
}

interface CommentsProps {
  comment: string;
  created: Date;
  user: string;
  name: string;
  taskId: string;
  id: string;
}
export default function TaskClient({ id }: TaskClientProps) {
  const { data: session } = useSession();
  const [task, setTask] = useState<TaskProps | null>(null);
  const [textArea, setTextArea] = useState("");
  const [comments, setComments] = useState<CommentsProps[]>([]);

  // getTask do fire base
  useEffect(() => {
    async function getTask() {
      const taskRef = doc(db, "listTask", id);
      const snapshot = await getDoc(taskRef);

      if (!snapshot.exists() || !snapshot.data()?.public) {
        toast.warn("Tarefa nao encotrada");
        setTask(null);
        redirect("/dashboard");
      }

      const data = snapshot.data();
      setTask({
        id: id,
        text: data?.text,
        created: data?.created.toDate(),
        public: data?.public,
        user: data?.user,
      });
    }
    getTask();
  }, [id]);

  // getComment do fire base
  useEffect(() => {
    async function getComments() {
      const q = query(collection(db, "comments"), where("taskId", "==", id));

      //  const snapshotComments = await getDocs(q);
      onSnapshot(q, (snapshot) => {
        const listComment = [] as CommentsProps[];
        snapshot.forEach((iten) => {
          listComment.push({
            id: iten.id,
            comment: iten.data().comment,
            user: iten.data().user,
            name: iten.data().name,
            created: iten.data().created.toDate(),
            taskId: iten.data().taskId,
          });
        });

        setComments(listComment);
      });
    }
    getComments();
  }, [id, comments]);

  async function handleComment(event: FormEvent) {
    event.preventDefault();
    if (!session?.user?.email || !session?.user?.name) return;
    await addDoc(collection(db, "comments"), {
      comment: textArea,
      created: new Date(),
      user: session?.user?.email,
      name: session?.user?.name,
      taskId: id,
    })
      .then(() => {
        toast.success("Comment add success");
        setTextArea("");
      })
      .catch((error) => {
        toast.error("ops cant not add comments :(");
        console.error(error);
      });
  }

  async function handleDeletComment(id: string) {
    const commentRef = doc(db, "comments", id);
    await deleteDoc(commentRef)
      .then(() => {
        toast.info("comment delete with success");
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="w-full flex justify-center">
      <main className="w-7/10 flex flex-col items-center max-sm:w-95/100">
        {task?.public ? (
          <>
            <h1 className="text-center text-3xl font-bold mt-20">Task</h1>
            <article className="w-full flex items-center justify-center  border-2 border-gray-300 mt-20 p-4 rounded-xl hover:border-blue-500 transition duration-500">
              <p className="text-xl whitespace-pre-wrap w-full break-words">
                {task?.text}
              </p>
            </article>
            <section className="w-full my-8">
              <h2 className="text-xl ">Leave comments</h2>
              <form onSubmit={handleComment} className="flex flex-col gap-6">
                <TextArea
                  className=""
                  placeholder="Type your task"
                  disabled={!session?.user}
                  value={textArea}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    setTextArea(event.target.value);
                  }}
                  required
                />
                <button
                  className="bg-blue-500 text-white w-full rounded-md h-13 text-xl cursor-pointer transition duration-500 hover:scale-102 disabled:bg-blue-200 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={!session?.user}
                >
                  Enviar comentario
                </button>
              </form>
            </section>
            <section className="w-full mt-8 flex flex-col gap-4">
              <h1 className="text-xl ">Every comments</h1>
              {comments.length === 0 && (
                <p className="font-bold mt-8 text-lg">No comments</p>
              )}

              {comments.map((item) => (
                <article
                  key={item.id}
                  className="border w-full p-3 rounded-xl flex flex-col gap-3"
                >
                  <div className="flex gap-3 items-center">
                    <span className="bg-gray-300 px-3 py-1 rounded-xl text-sm italic">
                      {item.name}
                    </span>

                    {item.user === session?.user?.email && (
                      <button
                        onClick={() => handleDeletComment(item.id)}
                        className="cursor-pointer transition duration-300 hover:scale-105"
                      >
                        <RiDeleteBin7Line size={25} color="red" />
                      </button>
                    )}
                  </div>
                  <div>
                    <p>{item.comment}</p>
                  </div>
                </article>
              ))}
            </section>
          </>
        ) : (
          <h1 className="text-2xl font-bold mt-15 flex flex-col gap-5 items-center">
            Carregando tarefa...{" "}
            <p>
              {" "}
              <AiOutlineLoading3Quarters
                className="animate-spin text-black"
                size={35}
              />
            </p>
          </h1>
        )}
      </main>
    </div>
  );
}
