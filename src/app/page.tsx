"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Scanner from "@/components/scanner/Scanner";

export default function HomePage() {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,153,0.1),transparent_50%)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-6xl text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-6xl font-bold leading-tight tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Se existe no mundo,
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-primary to-cyan-400 bg-clip-text text-transparent">
              chega na sua garagem.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-xl font-medium text-foreground/90 sm:text-2xl md:text-3xl"
          >
            Identificação por foto ou texto. Custo total garantido. Entrega sem fronteiras.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              size="lg"
              variant="neon"
              className="group h-16 px-10 text-xl font-semibold shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40"
              onClick={() => setScannerOpen(true)}
            >
              <Camera className="mr-3 h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Identificar peça agora →
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative border-t border-border/50 bg-card/30 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              Por que o GSE Import?
            </h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              A primeira máquina 100% autônoma de importação de peças automotivas
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group relative h-full border-primary/20 bg-card/80 p-8 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-2xl hover:shadow-primary/10">
                <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4">
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-yellow-400">
                  Identificação Instantânea
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Foto, texto, VIN ou código OEM → nossa IA identifica a peça exata em segundos, com compatibilidade confirmada.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group relative h-full border-primary/20 bg-card/80 p-8 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-2xl hover:shadow-primary/10">
                <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-primary">
                  Custo Total Garantido
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  GSE cobre a diferença se o imposto exceder o cálculo. Sem surpresas, sem estresse. Promessa inquebrável.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group relative h-full border-primary/20 bg-card/80 p-8 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-2xl hover:shadow-primary/10">
                <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4">
                  <Globe className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-cyan-400">
                  Busca Global Inteligente
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Varremos marketplaces, fóruns e sites técnicos em múltiplos idiomas. Se existe no mundo, encontramos.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Scanner open={scannerOpen} onOpenChange={setScannerOpen} />
    </main>
  );
}

