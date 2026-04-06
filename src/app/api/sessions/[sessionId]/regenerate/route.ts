import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateImage } from "@/lib/image-generator";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { photoId } = await req.json();

    // Get session
    const { data: session } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Get photo
    const { data: photo } = await supabaseAdmin
      .from("generated_photos")
      .select("*")
      .eq("id", photoId)
      .eq("session_id", sessionId)
      .single();

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Update status
    await supabaseAdmin
      .from("generated_photos")
      .update({ status: "generating" })
      .eq("id", photoId);

    // Regenerate
    const result = await generateImage(photo.prompt, session.selfie_url!);

    // Upload to storage
    const imageRes = await fetch(result.url);
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const fileName = `${sessionId}/${photo.scene_type}-${Date.now()}.jpg`;

    await supabaseAdmin.storage
      .from("generated-photos")
      .upload(fileName, imageBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    const { data: urlData } = supabaseAdmin.storage
      .from("generated-photos")
      .getPublicUrl(fileName);

    // Update record
    await supabaseAdmin
      .from("generated_photos")
      .update({
        image_url: urlData.publicUrl,
        status: "completed",
      })
      .eq("id", photoId);

    return NextResponse.json({ message: "Regeneration complete" });
  } catch (error) {
    console.error("Regeneration error:", error);
    return NextResponse.json(
      { error: "Regeneration failed" },
      { status: 500 }
    );
  }
}
