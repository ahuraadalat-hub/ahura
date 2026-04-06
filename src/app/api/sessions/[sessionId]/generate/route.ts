import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateImage } from "@/lib/image-generator";

export const maxDuration = 300; // 5 minutes for long generation

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get session and photos
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

    const { data: photos } = await supabaseAdmin
      .from("generated_photos")
      .select("*")
      .eq("session_id", sessionId)
      .eq("status", "pending")
      .order("sort_order", { ascending: true });

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: "No pending photos found" },
        { status: 400 }
      );
    }

    // Update session status
    await supabaseAdmin
      .from("sessions")
      .update({ status: "generating" })
      .eq("id", sessionId);

    // Generate images concurrently (2 at a time to avoid rate limits)
    const batchSize = 2;
    for (let i = 0; i < photos.length; i += batchSize) {
      const batch = photos.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (photo) => {
          try {
            // Update status to generating
            await supabaseAdmin
              .from("generated_photos")
              .update({ status: "generating" })
              .eq("id", photo.id);

            // Generate the image
            const result = await generateImage(
              photo.prompt,
              session.selfie_url!
            );

            // Download and upload to Supabase storage
            const imageRes = await fetch(result.url);
            const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
            const fileName = `${sessionId}/${photo.scene_type}.jpg`;

            const { error: uploadError } = await supabaseAdmin.storage
              .from("generated-photos")
              .upload(fileName, imageBuffer, {
                contentType: "image/jpeg",
                upsert: true,
              });

            if (uploadError) {
              throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // Get public URL
            const { data: urlData } = supabaseAdmin.storage
              .from("generated-photos")
              .getPublicUrl(fileName);

            // Update photo record
            await supabaseAdmin
              .from("generated_photos")
              .update({
                image_url: urlData.publicUrl,
                status: "completed",
              })
              .eq("id", photo.id);
          } catch (err) {
            console.error(`Failed to generate ${photo.scene_type}:`, err);
            await supabaseAdmin
              .from("generated_photos")
              .update({ status: "failed" })
              .eq("id", photo.id);
          }
        })
      );
    }

    // Check if all completed
    const { data: updatedPhotos } = await supabaseAdmin
      .from("generated_photos")
      .select("status")
      .eq("session_id", sessionId);

    const allDone = updatedPhotos?.every(
      (p) => p.status === "completed" || p.status === "failed"
    );

    if (allDone) {
      const hasFailures = updatedPhotos?.some((p) => p.status === "failed");
      await supabaseAdmin
        .from("sessions")
        .update({ status: hasFailures ? "failed" : "completed" })
        .eq("id", sessionId);
    }

    return NextResponse.json({ message: "Generation complete" });
  } catch (error) {
    console.error("Generation error:", error);

    const { sessionId } = await params;
    await supabaseAdmin
      .from("sessions")
      .update({ status: "failed" })
      .eq("id", sessionId);

    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
