import { HTMLProps } from "react";

export default function TextArea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return (
    <textarea
      name="task"
      id="task"
      rows={7}
      {...rest}
      className="bg-white w-full border-5 border-transparent rounded-xl mt-5 p-4 text-xl text-black hover:border-blue-500  transition duration-200"
    />
  );
}
