import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getAi() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set. Si estás en Vercel, asegúrate de añadir esta variable en Settings > Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Eres Kick, un coach de acción diaria para personas latinoamericanas que quieren arrancar con sus metas pero se sienten bloqueadas. Tu tono es cercano, directo, empático y motivador — como un amigo que te dice la verdad con cariño y te empuja a moverte.
Escribe siempre en español latinoamericano. Nunca uses lenguaje corporativo ni frases vacías. Sé específico, no genérico. Máximo 150 palabras por respuesta en cada modo. Nunca menciones que eres una IA.`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/daily-message", async (req, res) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Genera el MENSAJE DEL DÍA. Cuando el usuario carga la app, genera un mensaje motivador corto de máximo 3 líneas. Debe ser poderoso, accionable y específico. Evita frases genéricas. Termina siempre con una micro-acción concreta para los próximos 5 minutos. Varía el estilo cada vez: a veces usa una metáfora, a veces un dato, a veces una pregunta retórica.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      },
    });
    res.json({ message: response.text?.trim() });
  } catch (error: any) {
    console.error("Error generating daily message:", error);
    let errorMessage = "No pudimos obtener tu mensaje del día. ¡Pero arranca de todas formas!";
    if (error.message && (error.message.includes("429") || error.message.includes("503"))) {
      errorMessage = "El servicio está muy concurrido en este momento. Por favor, intenta de nuevo en unos segundos.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/confirm-goals", async (req, res) => {
  try {
    const { goals } = req.body;
    
    if (!goals || goals.length === 0) {
      return res.status(400).json({ error: "Faltan metas" });
    }

    const ai = getAi();
    const prompt = `Mis metas para hoy son:\n${goals.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}\n\nGenera la CONFIRMACIÓN DE METAS. Responde con un mensaje de confirmación breve y energético de 1 línea, y un micro-compromiso que sea la acción más pequeña posible para empezar con la primera meta en los próximos 10 minutos. Tono celebratorio pero enfocado en la acción inmediata.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confirmation: {
              type: Type.STRING,
              description: "Mensaje de confirmación breve y energético de 1 línea.",
            },
            microCommitment: {
              type: Type.STRING,
              description: "Micro-compromiso: la acción más pequeña posible para empezar con la primera meta en los próximos 10 minutos.",
            },
          },
          required: ["confirmation", "microCommitment"],
        },
      },
    });

    if (response.text) {
        res.json(JSON.parse(response.text));
    } else {
        throw new Error("Empty response text");
    }
  } catch (error: any) {
    console.error("Error confirming goals:", error);
    let errorMessage = "Error al procesar las metas.";
    if (error.message && (error.message.includes("429") || error.message.includes("503"))) {
      errorMessage = "El servicio está muy concurrido. Por favor, intenta de nuevo en unos segundos.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/unblock", async (req, res) => {
  try {
    const { issue } = req.body;
    
    if (!issue) {
      return res.status(400).json({ error: "Falta la descripción del bloqueo" });
    }

    const ai = getAi();
    const prompt = `Estoy atascado. Esto es lo que me pasa:\n"${issue}"\n\nGenera el DESBLOQUEO. Analiza la situación y entrega exactamente esto en formato estructurado:\nCONSEJO PERSONALIZADO: 2 a 3 líneas con un consejo específico basado en lo que escribí. No genérico. Que sienta que me entendiste.\nPREGUNTA PODEROSA: Una sola pregunta que me haga reflexionar y ver mi situación diferente. Que sea incómoda pero justa.\nPLAN DE 3 PASOS: Paso 1 con acción concreta para los próximos 5 minutos. Paso 2 con acción para la próxima hora. Paso 3 con acción para cerrar el día con progreso.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "Consejo personalizado de 2 a 3 líneas.",
            },
            question: {
              type: Type.STRING,
              description: "Una sola pregunta poderosa que lo haga reflexionar.",
            },
            planStep1: {
              type: Type.STRING,
              description: "Paso 1: acción concreta para los próximos 5 minutos.",
            },
            planStep2: {
              type: Type.STRING,
              description: "Paso 2: acción para la próxima hora.",
            },
            planStep3: {
              type: Type.STRING,
              description: "Paso 3: acción para cerrar el día con progreso.",
            },
          },
          required: ["advice", "question", "planStep1", "planStep2", "planStep3"],
        },
      },
    });

    if (response.text) {
        res.json(JSON.parse(response.text));
    } else {
        throw new Error("Empty response text");
    }
  } catch (error: any) {
    console.error("Error unblocking:", error);
    let errorMessage = "Error al procesar tu bloqueo. Intenta de nuevo.";
    if (error.message && (error.message.includes("429") || error.message.includes("503"))) {
      errorMessage = "El servicio está muy concurrido. Por favor, intenta de nuevo en unos segundos.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

export default app;
