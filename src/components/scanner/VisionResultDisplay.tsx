// src/components/scanner/VisionResultDisplay.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Search, ExternalLink, Star, Loader2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { VisionResult, HunterResult } from "@/types/gse";
import { formatPrice } from "@/utils/format-price";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useFiscalCalculation, FiscalCalculationResponse } from "@/hooks/use-fiscal-calculation";
import { FiscalBreakdown } from "@/components/scanner/FiscalBreakdown";
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
  hunterResults = [],
  isSearching,
  handleSearch,
  handleRemoveImage,
}: VisionResultDisplayProps) {
  const { toast } = useToast();
  const { exchangeRate } = useExchangeRate();
  const { calculate, isLoading: isCalculatingGlobal, error: fiscalError } = useFiscalCalculation();
  const [fiscalResults, setFiscalResults] = React.useState<Record<number, FiscalCalculationResponse>>({});
  const [calculatingIndex, setCalculatingIndex] = React.useState<number | null>(null);

  // Verificação de segurança
  if (!visionResult) {
    return (
      <Card className="border-destructive/20 bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Erro: resultado de identificação não disponível.
        </p>
      </Card>
    );
  }

  // Função para inferir país de origem baseado no marketplace
  const getOriginCountry = (marketplace: string): string => {
    if (!marketplace) return 'US'; // Fallback seguro
    const marketplaceMap: Record<string, string> = {
      'eBay': 'US',
      'Taobao': 'CN',
      'AliExpress': 'CN',
      'Amazon': 'US',
      'RockAuto': 'US',
      'AutoZone': 'US',
      'PartsGeek': 'US',
      'default': 'US',
    };
    return marketplaceMap[marketplace] || marketplaceMap.default;
  };

  // Função para estimar peso baseado no tipo de peça (placeholder - futuro: IA ou banco)
  const estimateWeight = (): number => {
    // Estimativa simples: 1kg para peças pequenas, 5kg para médias, 10kg para grandes
    // Futuro: usar IA ou banco de dados de peças
    return 2.0; // 2kg padrão
  };

  const handleCalculateFiscal = async (result: HunterResult, index: number) => {
    console.log('[VisionResultDisplay] handleCalculateFiscal chamado:', { result, index, visionResult });
    
    if (!visionResult?.ncmSuggestion) {
      console.warn('[VisionResultDisplay] NCM não disponível para cálculo fiscal');
      toast({
        title: "NCM não disponível",
        description: "A identificação não retornou código NCM. Não é possível calcular custo total.",
        variant: "destructive",
      });
      return;
    }

    if (!result?.price || !result?.currency || !result?.marketplace) {
      console.error('[VisionResultDisplay] Dados do resultado Hunter incompletos:', result);
      toast({
        title: "Dados incompletos",
        description: "O resultado da busca não contém informações suficientes para cálculo.",
        variant: "destructive",
      });
      return;
    }

    setCalculatingIndex(index);
    try {
      console.log('[VisionResultDisplay] Calculando custo fiscal para:', { 
        price: result.price, 
        currency: result.currency, 
        ncm: visionResult.ncmSuggestion,
        originCountry: getOriginCountry(result.marketplace),
        weightKg: estimateWeight()
      });
      
      const fiscalResult = await calculate({
        price: result.price,
        currency: result.currency,
        weightKg: estimateWeight(),
        ncm: visionResult.ncmSuggestion,
        originCountry: getOriginCountry(result.marketplace),
      });

      if (fiscalResult) {
        console.log('[VisionResultDisplay] Cálculo fiscal concluído:', fiscalResult);
        setFiscalResults((prev) => ({ ...prev, [index]: fiscalResult }));
        toast({
          title: "Custo calculado",
          description: "Custo total garantido calculado com sucesso!",
        });
      } else {
        console.warn('[VisionResultDisplay] Cálculo fiscal retornou null');
        toast({
          title: "Erro no cálculo",
          description: "Não foi possível calcular o custo total. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[VisionResultDisplay] Erro ao calcular custo fiscal:', error);
      toast({
        title: "Erro no cálculo",
        description: error instanceof Error ? error.message : "Erro desconhecido ao calcular custo.",
        variant: "destructive",
      });
    } finally {
      setCalculatingIndex(null);
    }
  };

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

          {visionResult.compatibility && visionResult.compatibility.length > 0 && (
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
          onClick={() => {
            console.log("[VisionResultDisplay] Botão buscar clicado, visionResult:", visionResult);
            if (handleSearch) {
              handleSearch();
            } else {
              console.error("[VisionResultDisplay] handleSearch não está definido");
            }
          }}
          disabled={isSearching || !visionResult}
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

      {hunterResults && hunterResults.length > 0 && (
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
            {hunterResults.map((result, index) => {
              if (!result) {
                console.warn(`[VisionResultDisplay] Resultado ${index} é null/undefined`);
                return null;
              }
              
              return (
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
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(result.url, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Ver detalhes
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCalculateFiscal(result, index)}
                        disabled={calculatingIndex === index || !visionResult?.ncmSuggestion}
                        title={!visionResult?.ncmSuggestion ? 'NCM não disponível' : 'Calcular custo total garantido'}
                      >
                        {calculatingIndex === index ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Calculando...
                          </>
                        ) : (
                          <>
                            <Calculator className="mr-2 h-3 w-3" />
                            Custo total
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
              );
            })}
          </div>
          
          {/* Exibir breakdowns fiscais */}
          {Object.entries(fiscalResults).map(([indexStr, fiscalResult]) => {
            const index = parseInt(indexStr);
            console.log(`[VisionResultDisplay] Renderizando breakdown fiscal ${index}:`, fiscalResult);
            
            if (!fiscalResult) {
              console.warn(`[VisionResultDisplay] Breakdown ${index} é null/undefined`);
              return null;
            }
            
            if (!fiscalResult.breakdown || !Array.isArray(fiscalResult.breakdown) || fiscalResult.breakdown.length === 0) {
              console.warn(`[VisionResultDisplay] Breakdown ${index} não tem itens válidos:`, fiscalResult.breakdown);
              return null;
            }
            
            if (!fiscalResult.totalGuaranteed || isNaN(fiscalResult.totalGuaranteed)) {
              console.warn(`[VisionResultDisplay] Breakdown ${index} tem totalGuaranteed inválido:`, fiscalResult.totalGuaranteed);
              return null;
            }
            
            return (
              <motion.div
                key={`fiscal-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <FiscalBreakdown
                  breakdown={fiscalResult.breakdown}
                  totalGuaranteed={fiscalResult.totalGuaranteed}
                  guaranteeNote={fiscalResult.guaranteeNote || 'GSE cobre a diferença se o imposto exceder o cálculo'}
                  onConfirm={() => {
                    console.log('[VisionResultDisplay] Confirmando pedido para resultado', index);
                    // TODO: Implementar confirmação de pedido
                    toast({
                      title: "Confirmação de pedido",
                      description: "Funcionalidade de confirmação de pedido será implementada em breve.",
                    });
                  }}
                />
              </motion.div>
            );
          })}
          
          {/* Exibir erro fiscal se houver */}
          {fiscalError && (
            <Card className="border-destructive/20 bg-card p-4">
              <p className="text-sm text-destructive">
                Erro ao calcular custo: {fiscalError}
              </p>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}

