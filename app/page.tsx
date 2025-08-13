"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThreeBackground from "@/components/threeBackground";

export default function Home() {
  const linkItems: { name: string; link: string }[] = [
    { name: "Portfolio", link: "https://gasparelo.dev/" },
    { name: "Blog", link: "https://blog.gasparelo.dev/" },
    { name: "Github", link: "https://github.com/barretoga" },
    {
      name: "Linkedin",
      link: "https://www.linkedin.com/in/gabrielbarretogasparelo/",
    },
    { name: "Dev.to", link: "https://dev.to/barretoga" },
  ];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ThreeBackground />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <motion.div
          className="mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Image
            className="dark:invert rounded-full mx-auto border-2"
            src="/perfil.jpg"
            alt="Cat image"
            width={180}
            height={38}
            priority
          />
        </motion.div>
        <motion.div className="flex flex-col gap-3 items-center justify-center w-full">
          {linkItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Button
                className="hover:cursor-pointer w-64 p-6"
                type="button"
                asChild
              >
                <Link href={item.link} target="_blank">
                  {item.name}
                </Link>
              </Button>
            </motion.div>
          ))}

          <div className="flex gap-x-2">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-primary rounded-md w-[48px] h-[48px] flex items-center justify-center"
            >
              <Link href="https://x.com/kkjbarreto" target="_blank">
                <Image
                  alt="twitter"
                  src="/xwitter.svg"
                  width={36}
                  height={36}
                  className="filter invert brightness-0"
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-primary rounded-md w-[48px] h-[48px] flex items-center justify-center"
            >
              <Link href="https://letterboxd.com/kkjbarreto/" target="_blank">
                <Image
                  alt="letterboxd"
                  src="/brand-letterboxd.png"
                  width={36}
                  height={36}
                  className="filter invert brightness-0"
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-primary rounded-md w-[48px] h-[48px] flex items-center justify-center"
            >
              <Link
                href="https://www.instagram.com/barreto_ga/"
                target="_blank"
              >
                <Image
                  alt="instagram"
                  src="/brand-instagram.png"
                  width={36}
                  height={36}
                  className="filter invert brightness-0"
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="bg-primary rounded-md w-[48px] h-[48px] flex items-center justify-center"
            >
              <Link
                href="https://myanimelist.net/profile/kkjbarreto"
                target="_blank"
              >
                <Image
                  alt="myanimelist"
                  src="/mal.png"
                  width={36}
                  height={36}
                  className="filter invert brightness-0"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center text-primary-foreground gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/barretoga"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/kitty.png"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Made by Barretoga
        </a>
      </footer>
    </div>
  );
}
