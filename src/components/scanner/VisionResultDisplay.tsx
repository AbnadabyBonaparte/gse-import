// src/components/scanner/VisionResultDisplay.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Search, ExternalLink, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VisionResult, HunterResult } from "@/types/gse";
import { formatPrice } from "@/utils/format-price";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { cn } from "@/lib/utils";

interface VisionResultDisplayProps {
  visionResult: VisionResult;
  imagePreview: string;
  hunterResults: HunterResult[];
  isSearching: boolean;
  handleSearch: () => void;
  handleRemoveImage: () => void;
}

export default function VisionResultDisplay({
  visionResult,
  imagePreview,
  hunterResults,
  isSearching,
  handleSearch,
  handleRemoveImage,
}: VisionResultDisplayProps) {
  const { exchangeRate } = useExchangeRate();

  return (
    <div className="space-y-4">
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
                      <Badge variant="default" className="bg-success/20 text-success border-success/30 text-xs">
                        Compatível confirmado
                      </Badge>
                    )}
                    {result.compatibility === "possible" && (
                      <Badge variant="outline" className="border-warning/30 text-warning text-xs">
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
                        {formatPrice(result.price, result.currency, exchangeRate)}
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
                          <Star className="h-3 w-3 fill-warning text-warning" />
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
    </div>
  );
}

