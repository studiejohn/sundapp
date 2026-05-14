import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { foodName, amount } = await req.json();

  if (!foodName) {
    return NextResponse.json({ error: "foodName required" }, { status: 400 });
  }

  const prompt = `Estimer næringsværdierne for: "${foodName}", mængde: "${amount || "100g"}".
Svar KUN med et JSON objekt i dette format (ingen markdown, ingen forklaring):
{"calories": <tal>, "protein": <tal i gram>, "carbs": <tal i gram>, "fat": <tal i gram>}
Brug realistiske gennemsnitsværdier. Hvis du er usikker, giv et rimeligt estimat.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const nutrition = JSON.parse(text.trim());
    return NextResponse.json(nutrition);
  } catch {
    return NextResponse.json({ error: "Could not parse nutrition data" }, { status: 500 });
  }
}
