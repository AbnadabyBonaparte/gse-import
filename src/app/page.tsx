// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Se existe no mundo,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              chega na sua garagem.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-lg text-muted-foreground sm:text-xl md:text-2xl"
          >
            Identificação por foto. Custo total garantido. Entrega sem fronteiras.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              variant="neon"
              className="group h-14 px-8 text-lg font-semibold"
            >
              <Camera className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Tirar foto da peça →
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid gap-6 sm:grid-cols-3"
          >
            <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Identificação Instantânea
              </h3>
              <p className="text-sm text-muted-foreground">
                Foto ou VIN → IA identifica a peça exata em segundos
              </p>
            </Card>
            <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Custo Total Garantido
              </h3>
              <p className="text-sm text-muted-foreground">
                GSE cobre a diferença se o imposto exceder o cálculo
              </p>
            </Card>
            <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Entrega Sem Surpresas
              </h3>
              <p className="text-sm text-muted-foreground">
                Rastreio em tempo real, do sourcing até sua porta
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

