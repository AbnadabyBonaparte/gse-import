import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface VisionResponse {
  description: string;
  partName: string;
  compatibility: string[];
  confidence: number;
  ncmSuggestion: string;
  oemCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhuma imagem fornecida" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const systemPrompt = `Você é um especialista técnico em peças automotivas para o mercado brasileiro. Sua função é identificar peças automotivas com precisão máxima.

Analise a imagem fornecida e identifique:
1. Nome exato da peça (ex: "Bomba d'água", "Radiador", "Disco de freio")
2. Modelos de carros compatíveis (marca, modelo, geração, anos)
3. Código OEM ou número de peça (se visível na imagem)
4. Nível de confiança da identificação (0-100%)
5. Sugestão de NCM (Nomenclatura Comum do Mercosul) mais provável
6. Descrição técnica detalhada

Responda APENAS em JSON válido com esta estrutura exata:
{
  "description": "Descrição técnica completa da peça",
  "partName": "Nome exato da peça",
  "compatibility": ["Modelo 1", "Modelo 2", "Modelo 3"],
  "confidence": 95,
  "ncmSuggestion": "8708.99.90",
  "oemCode": "06H121026H"
}

Se não conseguir identificar com certeza (confiança < 70%), indique isso claramente no JSON.`;

    const userPrompt = `Analise esta imagem de peça automotiva e identifique todos os detalhes possíveis.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Resposta vazia da API" },
        { status: 500 }
      );
    }

    let visionData: VisionResponse;
    try {
      visionData = JSON.parse(content);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Erro ao processar resposta da API" },
        { status: 500 }
      );
    }

    if (!visionData.partName || !visionData.description) {
      return NextResponse.json(
        { error: "Resposta incompleta da API" },
        { status: 500 }
      );
    }

    return NextResponse.json(visionData);
  } catch (error: unknown) {
    console.error("Erro na API Vision:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `Erro da OpenAI: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Erro interno do servidor";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

