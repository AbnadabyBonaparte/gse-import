// src/components/scanner/FiscalBreakdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface BreakdownItem {
  label: string;
  value: number;
  percentage?: number;
}

interface FiscalBreakdownProps {
  breakdown: BreakdownItem[];
  totalGuaranteed: number;
  guaranteeNote: string;
  onConfirm?: () => void;
}

// Função para formatar valores em BRL
const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Componente para animação de contagem
const CountUp = ({ end, duration = 1 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Reset count when end changes
    setCount(0);
    
    if (end <= 0 || isNaN(end)) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      const currentCount = Math.floor(end * percentage);
      
      setCount(currentCount);
      
      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  return <span>{formatBRL(count)}</span>;
};

// Componente para barra de porcentagem
const PercentageBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
      <motion.div 
        className="bg-primary h-1.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  );
};

export function FiscalBreakdown({ 
  breakdown, 
  totalGuaranteed, 
  guaranteeNote,
  onConfirm 
}: FiscalBreakdownProps) {
  // Verificações de segurança
  if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
    return (
      <Card className="border-destructive/20 bg-card p-6">
        <p className="text-sm text-destructive">
          Erro: breakdown fiscal não disponível.
        </p>
      </Card>
    );
  }

  if (!totalGuaranteed || isNaN(totalGuaranteed)) {
    return (
      <Card className="border-destructive/20 bg-card p-6">
        <p className="text-sm text-destructive">
          Erro: total garantido inválido.
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border border-primary/30 bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden">
        <CardHeader className="border-b border-primary/20 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold text-foreground">
              Custo Total Garantido
            </CardTitle>
            <Badge 
              className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-sm font-medium"
              variant="secondary"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Garantia GSE
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Lista de itens */}
          <div className="space-y-4 mb-6">
            {breakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex justify-between items-start py-2 border-b border-border/50"
              >
                <div className="flex-1">
                  <p className="text-foreground">{item.label}</p>
                  {item.percentage !== undefined && (
                    <PercentageBar percentage={item.percentage} />
                  )}
                </div>
                <div className="font-mono text-right">
                  <p className="text-foreground font-medium">
                    <CountUp end={item.value} />
                  </p>
                  {item.percentage !== undefined && (
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Total garantido */}
          <motion.div 
            className="border-t border-primary/30 pt-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-foreground">Total Garantido</p>
              <p className="text-2xl font-bold text-primary glow-neon">
                <CountUp end={totalGuaranteed} duration={1.5} />
              </p>
            </div>
          </motion.div>
          
          {/* Nota de garantia */}
          <motion.div 
            className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <p className="text-primary text-sm font-medium flex items-start">
              <ShieldCheck className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {guaranteeNote}
            </p>
          </motion.div>
          
          {/* Botão de confirmação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Button 
              onClick={onConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-lg transition-all duration-300 glow-neon-hover"
            >
              Confirmar Pedido
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
