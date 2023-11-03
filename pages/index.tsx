import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Conveyor from "@/components/Conveyor";
import Overlay from "@/components/Overlay";

export default function Home() {
  return (
    <main className={`fixed min-h-screen ${inter.className}`}>
      <Image
        className="w-auto h-[100vh] object-left object-cover"
        src="/assets/glass.png"
        alt="glass"
        width={5000}
        height={3000}
      />
      <Conveyor />
      <Overlay />
    </main>
  );
}
