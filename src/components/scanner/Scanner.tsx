"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  ScanLine,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ScannerState = "empty" | "loaded" | "processing" | "success" | "error";

interface VisionResult {
  description: string;
  partName: string;
  compatibility: string[];
  confidence: number;
  ncmSuggestion: string;
  oemCode?: string;
}

interface ScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Scanner({ open, onOpenChange }: ScannerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [state, setState] = useState<ScannerState>("empty");
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setState("loaded");
      setVisionResult(null);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setState("empty");
    setVisionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleIdentify = async () => {
    if (!imageFile) return;

    setState("processing");
    setVisionResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Erro ao identificar peça. Tente novamente."
        );
      }

      const data: VisionResult = await response.json();

      if (!data.partName || !data.description) {
        throw new Error("Resposta incompleta da API");
      }

      setVisionResult(data);
      setState("success");
    } catch (error) {
      console.error("Erro na identificação:", error);
      setState("error");
      toast({
        title: "Erro na identificação",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível identificar a peça. Tente novamente.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setState("loaded");
              handleIdentify();
            }}
          >
            Tentar novamente
          </Button>
        ),
      });
    }
  };

  const handleClose = () => {
    if (state === "processing") return;
    onOpenChange(false);
    setTimeout(() => {
      handleRemoveImage();
    }, 300);
  };

  const Content = (
    <div className="space-y-6" aria-live="polite" aria-atomic="true">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Identificar Peça
        </h2>
        <p className="text-sm text-muted-foreground">
          Tire uma foto ou faça upload da imagem da peça automotiva
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Label htmlFor="file-upload" className="sr-only">
              Upload de imagem
            </Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
              aria-label="Escolher foto da peça"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card/50",
                "min-h-[300px] cursor-pointer hover:border-primary/50"
              )}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Área de upload - arraste uma imagem ou clique para escolher"
            >
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-medium text-foreground">
                    Arraste uma imagem aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para escolher
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Escolher foto
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {state === "loaded" && (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={imagePreview}
                alt="Preview da peça"
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={handleRemoveImage}
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              variant="neon"
              size="lg"
              className="w-full"
              onClick={handleIdentify}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Identificar peça
            </Button>
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={imagePreview}
                alt="Processando identificação"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Analisando peça...
                  </p>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="h-1 w-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-60" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {state === "success" && visionResult && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border-primary/20 bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {visionResult.partName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {visionResult.description}
                    </p>
                  </div>
                </div>

                {visionResult.compatibility.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Compatível com:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {visionResult.compatibility.map((model, index) => (
                        <span
                          key={index}
                          className="rounded-md border border-border bg-card px-3 py-1 text-xs text-foreground"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {visionResult.oemCode && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Código OEM:
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {visionResult.oemCode}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      Confiança da identificação
                    </span>
                    <span className="text-muted-foreground">
                      {visionResult.confidence}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${visionResult.confidence}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {visionResult.ncmSuggestion && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Sugestão NCM:
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {visionResult.ncmSuggestion}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={imagePreview}
                alt="Peça identificada"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleRemoveImage}
              >
                Nova foto
              </Button>
              <Button
                type="button"
                variant="neon"
                className="flex-1"
                disabled
                aria-label="Buscar opções no mundo (em desenvolvimento)"
                title="Em breve"
              >
                Buscar opções no mundo
              </Button>
            </div>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="border-destructive/20 bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-destructive/10 p-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Erro na identificação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Não foi possível identificar a peça. Tente novamente com
                    outra foto.
                  </p>
                </div>
              </div>
            </Card>

            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={imagePreview}
                alt="Erro na identificação"
                className="h-full w-full object-cover opacity-50"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleRemoveImage}
              >
                Nova foto
              </Button>
              <Button
                type="button"
                variant="default"
                className="flex-1"
                onClick={() => {
                  setState("loaded");
                  handleIdentify();
                }}
              >
                Tentar novamente
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Identificar Peça</SheetTitle>
            <SheetDescription>
              Tire uma foto ou faça upload da imagem da peça automotiva
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">{Content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Identificar Peça</DialogTitle>
          <DialogDescription>
            Tire uma foto ou faça upload da imagem da peça automotiva
          </DialogDescription>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
}
