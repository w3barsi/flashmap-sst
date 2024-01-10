"use client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function CreateTest() {
  const router = useRouter();
  const { mutate } = api.test.create.useMutation({
    onSuccess() {
      router.refresh();
    },
  });
  return (
    <button
      className="rounded bg-black p-3 text-white"
      onClick={() => mutate()}
    >
      Create Test
    </button>
  );
}
