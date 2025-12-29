// src/app/page.tsx (Exemplo de Next.js App Router)
"use client";
import { useState } from "react";
import Scanner from "@/components/Scanner";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";

// Este é o componente principal da sua página.
export default function HomePage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          GSE Import - Global Sourcing Engine
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/AbnadabyBonaparte/gse-import"
            target="_blank"
            rel="noopener noreferrer"
          >
            Por Abnadaby Bonaparte
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <h1 className="text-6xl font-bold text-center">
            GSE Import
        </h1>
      </div>

      <div className="mt-10 flex flex-col items-center space-y-4">
        <p className="text-lg text-center max-w-lg text-muted-foreground">
            A primeira máquina 100% autônoma de importação de peças automotivas do Brasil.
        </p>
        <Button
            variant="neon"
            size="lg"
            className="mt-6 text-lg px-8 py-6"
            onClick={() => setIsScannerOpen(true)}
        >
            <ScanLine className="mr-3 h-6 w-6" />
            Iniciar Scanner de Peças
        </Button>
      </div>

      {/* O componente Scanner refatorado */}
      <Scanner
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
      />
    </main>
  );
}
