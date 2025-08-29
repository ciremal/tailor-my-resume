import { Uploader } from "@/components/features/uploader/Uploader";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 flex-col text-black">
      <div className="my-10">Upload file here</div>
      <div className="w-1/2">
        <Uploader />
        {/* <Skills /> */}
      </div>
    </main>
  );
}
