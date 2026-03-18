import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are FitCoach AI, an expert fitness coach and health advisor.
You provide accurate, practical, and motivating fitness advice.
- Answer questions about workouts, nutrition, recovery, and fitness science
- Give specific, actionable advice
- Be encouraging but honest
- Keep responses concise (2-4 sentences unless more detail is needed)
- If asked about calories burned, use standard MET-based estimates
- Always recommend consulting a healthcare professional for medical concerns`;

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[GET /api/chat] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message: userMessage } = body;

    if (!userMessage?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: userMessage,
      },
    });

    // Get last 10 messages for context (excluding the one just saved)
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 11,
    });

    const historyMessages = recentMessages.reverse().slice(0, -1);

    // Build Gemini chat history
    const history = historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const assistantText = result.response.text();

    // Save assistant response
    const savedMessage = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: assistantText,
      },
    });

    return NextResponse.json({
      message: {
        ...savedMessage,
        createdAt: savedMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[POST /api/chat] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
