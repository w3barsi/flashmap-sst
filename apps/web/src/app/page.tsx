import { AlignLeftIcon } from "lucide-react";
import { type ReactNode } from "react";

import MaxWidthWrapper from "~/components/max-width-wrapper";

import FileList from "./_components/files-list";

const topics = [
  " Algebra and Geometry ",
  " Biology: Cells, Genetics, Evolution ",
  " World History: Ancient to Modern ",
  " Literature: Novels, Plays, Poems ",
  " Chemistry: Matter, Reactions, Atomic Structure ",
  " Physics: Forces, Energy, Motion ",
  " Spanish: Language, Culture, Communication ",
  " Environmental Science: Ecology, Conservation, Sustainability ",
  " Economics: Supply, Demand, Market Systems ",
  " Computer Science: Coding, Algorithms, Software Development ",
];

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white p-3 transition-all">
      <MaxWidthWrapper>
        <div className="h-80 w-full items-center justify-center rounded-xl border-2 text-2xl font-bold  shadow-brut shadow-black">
          Upload Dropzone
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <h1 className="p-3 pt-5 text-4xl">Uploaded Files:</h1>
        <FileList topics={topics} />
      </MaxWidthWrapper>
    </main>
  );
}

const DivWithIconProps = (props: { icon: ReactNode }) => {
  return <div>{props.icon}</div>;
};

// Sample call
<DivWithIconProps icon={<AlignLeftIcon />} />;
