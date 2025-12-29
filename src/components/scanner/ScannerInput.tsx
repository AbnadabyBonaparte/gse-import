// src/components/scanner/ScannerInput.tsx
"use client";

import * as React from "react";
import { Camera, Upload, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ScannerInputProps {
  textInput: string;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isDragging: boolean;
  canIdentify: boolean;
  handleIdentify: () => void;
  isProcessing: boolean;
  imagePreview?: string;
  handleRemoveImage?: () => void;
}

export default function ScannerInput({
  textInput,
  handleTextChange,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleInputChange,
  fileInputRef,
  isDragging,
  canIdentify,
  handleIdentify,
  isProcessing,
  imagePreview,
  handleRemoveImage,
}: ScannerInputProps) {
  return (
    <div className="space-y-4">
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

      {imagePreview && handleRemoveImage && (
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      )}

      {textInput.trim().length > 0 && !imagePreview && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Descrição da peça
          </Label>
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <p className="text-sm text-foreground">{textInput}</p>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="neon"
        size="lg"
        className="w-full"
        onClick={handleIdentify}
        disabled={!canIdentify || isProcessing}
      >
        <ScanLine className="mr-2 h-5 w-5" />
        {isProcessing ? "Processando..." : "Identificar peça"}
      </Button>
    </div>
  );
}

