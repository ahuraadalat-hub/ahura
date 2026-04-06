import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { analyzeSelfiAndGeneratePrompts } from "@/lib/gemini";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update status
    await supabaseAdmin
      .from("sessions")
      .update({ status: "analyzing" })
      .eq("id", sessionId);

    // Download selfie and convert to base64
    const selfieRes = await fetch(session.selfie_url!);
    const selfieBuffer = await selfieRes.arrayBuffer();
    const selfieBase64 = Buffer.from(selfieBuffer).toString("base64");

    // Generate prompts with Gemini
    const prompts = await analyzeSelfiAndGeneratePrompts(
      selfieBase64,
      session.platform as "tinder" | "hinge" | "both",
      session.gender,
      session.style_preference
    );

    // Save prompts to DB
    const photoRecords = prompts.map((p, i) => ({
      session_id: sessionId,
      prompt: p.prompt,
      scene_type: p.scene_type,
      sort_order: i,
      status: "pending" as const,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("generated_photos")
      .insert(photoRecords);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save prompts");
    }

    return NextResponse.json({
      message: "Analysis complete",
      prompts: prompts.map((p) => ({
        scene_type: p.scene_type,
        description: p.description,
      })),
    });
  } catch (error) {
    console.error("Analysis error:", error);

    const { sessionId } = await params;
    await supabaseAdmin
      .from("sessions")
      .update({ status: "failed" })
      .eq("id", sessionId);

    return NextResponse.json(
      { error: "Failed to analyze selfie" },
      { status: 500 }
    );
  }
}
