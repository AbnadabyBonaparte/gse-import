// src/hooks/use-gse-api.ts
import { useState, useCallback } from "react";
import { VisionResult, HunterResult, ApiError } from "@/types/gse";

interface VisionPayload {
  imageFile: File | null;
  textInput: string;
}

interface HunterPayload {
  query: string;
}

export const useGSEApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async <T, P>(endpoint: string, payload: P, isFormData: boolean = false): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      let body: FormData | string;
      let headers: HeadersInit = {};

      if (isFormData) {
        body = payload as FormData;
      } else {
        body = JSON.stringify(payload);
        headers = { "Content-Type": "application/json" };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: isFormData ? undefined : headers, // Deixa o browser definir Content-Type para FormData
        body: body,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: "Erro desconhecido", message: "Falha na comunicação com a API", statusCode: response.status }));
        throw new Error(errorData.message || errorData.error || `Erro HTTP: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      setError(errorMessage);
      console.error(`API Call Error (${endpoint}):`, err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const identifyPart = useCallback(async ({ imageFile, textInput }: VisionPayload): Promise<VisionResult | null> => {
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    if (textInput.trim()) formData.append("text", textInput.trim());

    if (!imageFile && !textInput.trim()) {
      setError("Nenhuma imagem ou texto fornecido para identificação.");
      return null;
    }

    return callApi<VisionResult, FormData>("/api/vision", formData, true);
  }, [callApi]);

  const searchPart = useCallback(async ({ query }: HunterPayload): Promise<HunterResult[] | null> => {
    if (!query) {
      setError("A query de busca está vazia.");
      return null;
    }
    const data = await callApi<{ results: HunterResult[] }>("/api/hunter/search", { query });
    return data ? data.results : null;
  }, [callApi]);

  return {
    isLoading,
    error,
    identifyPart,
    searchPart,
    clearError: () => setError(null),
  };
};
