import Image from "next/image";
import { Uploader } from "../components/features/uploader/Uploader";
import Skills from "@/components/features/skills/Skills";
import Experiences from "@/components/features/experiences/Experiences";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 flex-col text-black">
      <div className="my-10">Upload file here</div>
      <div className="w-1/2 flex flex-col gap-10 mb-100">
        <Uploader />
        <Skills />
        <Experiences />
      </div>
    </main>
  );
}
