// src/types/gse.ts

export type ScannerState = "empty" | "loaded" | "processing" | "success" | "error";

export interface VisionResult {
  description: string;
  partName: string;
  compatibility: string[];
  confidence: number;
  ncmSuggestion: string;
  oemCode?: string;
}

export interface HunterResult {
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

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
