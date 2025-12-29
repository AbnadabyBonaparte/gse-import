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
  Search,
  ExternalLink,
  Star,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

interface HunterResult {
  title: string;
  url: string;
  price: number;
  currency: string;
  seller: string;
  marketplace: string;
  imageUrl?: string;
  shippingEstimate?: string;
  rating?: number;
  compatibility?: "confirmed" | "possible" | "unknown";
}

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
  const [isSearching, setIsSearching] = useState(false);
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
      setState(prev => prev === "empty" ? "loaded" : prev);
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
  };

  // CORREÇÃO 1: Textarea agora funciona 100%
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    // Atualiza estado loaded se tiver texto ou imagem
    if (value.trim() && state === "empty") {
      setState("loaded");
    } else if (!value.trim() && !imageFile && state === "loaded") {
      setState("empty");
    }
  };

  const canIdentify = !!imageFile || textInput.trim().length > 0;

  const handleIdentify = async () => {
    if (!canIdentify) return;
    setState("processing");
    setVisionResult(null);
    setHunterResults([]);

    try {
      const formData = new FormData();
      if (imageFile) formData.append("image", imageFile);
      if (textInput.trim()) formData.append("text", textInput.trim());

      const response = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erro na identificação");
      }

      const data: VisionResult = await response.json();
      setVisionResult(data);
      setState("success");
    } catch (err) {
      console.error("Vision error:", err);
      setState("error");
      toast({
        title: "Erro na identificação",
        description: "Tente novamente com outra foto ou descrição.",
        variant: "destructive",
      });
    }
  };

  // CORREÇÃO 2: Hunter com query otimizada para código OEM e peça simples
  const handleSearch = async () => {
    if (!visionResult) return;
    setIsSearching(true);
    setHunterResults([]);

    toast({
      title: "Buscando no mundo...",
      description: "Varrendo eBay, RockAuto, Amazon e mais...",
    });

    try {
      // Query enriquecida com código OEM entre aspas exatas
      let query = visionResult.partName;
      if (visionResult.oemCode) query += ` "${visionResult.oemCode}"`;
      if (visionResult.compatibility.length) query += ` ${visionResult.compatibility.join(" ")}`;
      if (textInput.trim()) query += ` ${textInput.trim()}`;

      const response = await fetch("/api/hunter/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Erro na busca");
      }

      const data = await response.json();
      if (!data.results?.length) {
        toast({
          title: "Peça rara",
          description: "Não encontramos em estoque novo. Pode ser item de restauração ou desmanche.",
        });
        setHunterResults([]);
      } else {
        setHunterResults(data.results);
      }
    } catch (err) {
      console.error("Hunter error:", err);
      toast({
        title: "Erro na busca",
        description: "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    if (currency === "USD") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(price * 5.5);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const handleClose = () => {
    if (state === "processing" || isSearching) return;
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
          Descreva a peça, tire uma foto ou ambos. Quanto mais informações, melhor a identificação.
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
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-sm font-medium text-foreground">
                Descreva a peça (opcional)
              </Label>
              <Textarea
                id="text-input"
                placeholder="Ex: Bomba d'água para VW Golf GTI 2015, código OEM 06H121026H, ou VIN: WVWZZZ1KZAW123456"
                value={textInput}
                onChange={handleTextChange}
                className="min-h-[120px] resize-none text-base"
                aria-label="Campo de texto para descrever a peça"
              />
              <p className="text-xs text-muted-foreground">
                Informe marca, modelo, ano, código OEM, VIN ou qualquer referência que você tenha
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

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

            <Button
              type="button"
              variant="neon"
              size="lg"
              className="w-full"
              onClick={handleIdentify}
              disabled={!canIdentify}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Identificar peça
            </Button>
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
            {textInput.trim().length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Descrição da peça
                </Label>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <p className="text-sm text-foreground">{textInput}</p>
                </div>
              </div>
            )}

            {imagePreview && (
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
            )}

            <Button
              type="button"
              variant="neon"
              size="lg"
              className="w-full"
              onClick={handleIdentify}
              disabled={!canIdentify}
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
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="Buscar opções no mundo"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar opções no mundo
                  </>
                )}
              </Button>
            </div>

            {isSearching && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {hunterResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Opções encontradas
                  </h3>
                  <Badge variant="secondary">
                    {hunterResults.length} resultado
                    {hunterResults.length > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {hunterResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          "group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg",
                          index === 0 && "border-primary/30"
                        )}
                      >
                        <div className="bg-card/50 border-b border-border/50 px-4 py-2 flex gap-2 flex-wrap">
                          {index === 0 && (
                            <Badge variant="default" className="text-xs">
                              Melhor custo-benefício
                            </Badge>
                          )}
                          {result.compatibility === "confirmed" && (
                            <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              Compatível confirmado
                            </Badge>
                          )}
                          {result.compatibility === "possible" && (
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                              Pode servir
                            </Badge>
                          )}
                        </div>
                        <div className="relative aspect-square w-full overflow-hidden bg-card">
                          {result.imageUrl ? (
                            <img
                              src={result.imageUrl}
                              alt={result.title}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
                            {result.title}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-primary">
                              {formatPrice(result.price, result.currency)}
                            </p>
                            {result.shippingEstimate && (
                              <p className="text-xs text-muted-foreground">
                                + {result.shippingEstimate}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                {result.marketplace}
                              </span>
                            </div>
                            {result.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-muted-foreground">
                                  {result.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.seller}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(result.url, "_blank")}
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Ver detalhes
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
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
