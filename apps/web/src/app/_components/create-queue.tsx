"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function CreateQueue() {
  const router = useRouter();
  const [status, setStatus] = useState("Waiting for input");
  const [input, setInput] = useState("");
  const { mutate } = api.test.createMessage.useMutation({
    onMutate() {
      setStatus("Sending queue...");
    },
    onSuccess() {
      setStatus("Queue Sent");
    },
  });
  return (
    <div className="flex flex-col gap-3">
      <input className="text-black" onChange={(e) => setInput(e.target.value)} value={input} />

      <button
        className="rounded bg-black p-3 text-white"
        onClick={() => mutate({ message: input })}
      >
        {status}
      </button>
    </div>
  );
}
