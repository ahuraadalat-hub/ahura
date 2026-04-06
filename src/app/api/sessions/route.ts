import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { selfieBase64, platform, gender, stylePreference } = await req.json();

    if (!selfieBase64) {
      return NextResponse.json(
        { error: "Selfie image is required" },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();

    // Upload selfie to Supabase Storage
    const buffer = Buffer.from(selfieBase64, "base64");
    const fileName = `${sessionId}.jpg`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("selfies")
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload selfie" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("selfies")
      .getPublicUrl(fileName);

    // Create session in DB
    const { error: dbError } = await supabaseAdmin
      .from("sessions")
      .insert({
        id: sessionId,
        selfie_url: urlData.publicUrl,
        platform: platform || "both",
        gender: gender || null,
        style_preference: stylePreference || null,
        status: "pending",
      });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId, selfieUrl: urlData.publicUrl });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
