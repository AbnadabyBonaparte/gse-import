// src/components/Scanner.tsx (Refatorado)
"use client";
import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGSEApi } from "@/hooks/use-gse-api";
import { ScannerState, VisionResult, HunterResult } from "@/types/gse";
import ScannerInput from "@/components/scanner/ScannerInput";
import VisionResultDisplay from "@/components/scanner/VisionResultDisplay";

interface ScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Scanner({ open, onOpenChange }: ScannerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [state, setState] = useState<ScannerState>("empty");
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);
  const [hunterResults, setHunterResults] = useState<HunterResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isLoading, error, identifyPart, searchPart, clearError } = useGSEApi();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Efeito para exibir erros da API
  useEffect(() => {
    if (error) {
      setState("error");
      toast({
        title: "Erro na operação",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

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
      setHunterResults([]);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setVisionResult(null);
    setHunterResults([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!textInput.trim()) setState("empty");
    else setState("loaded"); // Se houver texto, volta para loaded
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    // Atualiza estado loaded se tiver texto ou imagem
    if (value.trim() || imageFile) {
      setState("loaded");
    } else {
      setState("empty");
    }
  };

  const canIdentify = !!imageFile || textInput.trim().length > 0;

  const handleIdentify = async () => {
    if (!canIdentify || isLoading) return;
    setState("processing");
    setVisionResult(null);
    setHunterResults([]);

    const result = await identifyPart({ imageFile, textInput });

    if (result) {
      setVisionResult(result);
      setState("success");
    } else {
      // O erro já é tratado pelo useEffect e useGSEApi
      setState("error");
    }
  };

  const handleSearch = async () => {
    if (!visionResult || isLoading) return;

    toast({
      title: "Buscando no mundo...",
      description: "Varrendo eBay, RockAuto, Amazon e mais...",
    });

    // Query enriquecida com código OEM entre aspas exatas
    let query = visionResult.partName;
    if (visionResult.oemCode) query += ` "${visionResult.oemCode}"`;
    if (visionResult.compatibility.length) query += ` ${visionResult.compatibility.join(" ")}`;
    if (textInput.trim()) query += ` ${textInput.trim()}`;

    const results = await searchPart({ query });

    if (results) {
      if (!results.length) {
        toast({
          title: "Peça rara",
          description: "Não encontramos em estoque novo. Pode ser item de restauração ou desmanche.",
        });
      }
      setHunterResults(results);
    }
    // O erro já é tratado pelo useEffect e useGSEApi
  };

  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
    setTimeout(() => {
      handleRemoveImage();
      setState("empty");
    }, 300);
  };

  const Content = (
    <div className="space-y-6" aria-live="polite" aria-atomic="true">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Identificar Peça
        </h2>
        <p className="text-sm text-muted-foreground">
          Descreva a peça, tire uma foto ou ambos. Quanto mais informações, melhor a identificação.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {(state === "empty" || state === "loaded") && (
          <ScannerInput
            textInput={textInput}
            handleTextChange={handleTextChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleInputChange={handleInputChange}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            canIdentify={canIdentify}
            handleIdentify={handleIdentify}
            isProcessing={isLoading}
          />
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">
              Analisando imagem com GPT-4o Vision...
            </p>
          </div>
        )}

        {state === "success" && visionResult && (
          <VisionResultDisplay
            visionResult={visionResult}
            imagePreview={imagePreview}
            hunterResults={hunterResults}
            isSearching={isLoading}
            handleSearch={handleSearch}
            handleRemoveImage={handleRemoveImage}
          />
        )}

        {state === "error" && (
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
                  {error || "Não foi possível identificar a peça. Tente novamente com outra foto ou descrição."}
                </p>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setState("loaded");
                    handleIdentify();
                  }}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </Card>
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
          <div className="mt-6 overflow-y-auto pb-10">{Content}</div>
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
        <div className="max-h-[80vh] overflow-y-auto">{Content}</div>
      </DialogContent>
    </Dialog>
  );
}
