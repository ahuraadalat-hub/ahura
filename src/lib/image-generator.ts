export interface ImageGenerationResult {
  url: string;
  seed: number;
}

export async function generateImage(
  prompt: string,
  selfieUrl: string
): Promise<ImageGenerationResult> {
  const falKey = process.env.FAL_KEY!;

  // Use fal.ai's face-swap / IP-adapter pipeline for consistent face
  // Model: Nano Banana Pro via fal.ai's FLUX with face reference
  const response = await fetch("https://queue.fal.run/fal-ai/flux-general/image-to-image", {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      image_url: selfieUrl,
      strength: 0.65,
      num_inference_steps: 30,
      guidance_scale: 7.5,
      image_size: "portrait_4_3",
      num_images: 1,
      enable_safety_checker: true,
      output_format: "jpeg",
    }),
  });

  if (!response.ok) {
    // If the queue-based endpoint returns a request ID, poll for results
    const data = await response.json();

    if (data.request_id) {
      return await pollForResult(data.request_id, falKey);
    }

    throw new Error(`fal.ai API error: ${response.status} ${JSON.stringify(data)}`);
  }

  const data = await response.json();

  // Handle queued response
  if (data.request_id && !data.images) {
    return await pollForResult(data.request_id, falKey);
  }

  return {
    url: data.images[0].url,
    seed: data.seed || 0,
  };
}

async function pollForResult(
  requestId: string,
  falKey: string,
  maxAttempts = 60
): Promise<ImageGenerationResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/flux-general/requests/${requestId}/status`,
      {
        headers: { Authorization: `Key ${falKey}` },
      }
    );

    const statusData = await statusRes.json();

    if (statusData.status === "COMPLETED") {
      const resultRes = await fetch(
        `https://queue.fal.run/fal-ai/flux-general/requests/${requestId}`,
        {
          headers: { Authorization: `Key ${falKey}` },
        }
      );
      const resultData = await resultRes.json();
      return {
        url: resultData.images[0].url,
        seed: resultData.seed || 0,
      };
    }

    if (statusData.status === "FAILED") {
      throw new Error(`Image generation failed: ${JSON.stringify(statusData)}`);
    }
  }

  throw new Error("Image generation timed out");
}

// Alternative: Direct generation without face reference (for fallback)
export async function generateImageFromPrompt(
  prompt: string
): Promise<ImageGenerationResult> {
  const falKey = process.env.FAL_KEY!;

  const response = await fetch("https://queue.fal.run/fal-ai/flux/dev", {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      image_size: "portrait_4_3",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
      output_format: "jpeg",
    }),
  });

  const data = await response.json();

  if (data.request_id && !data.images) {
    return await pollForResult(data.request_id, falKey);
  }

  if (!data.images || !data.images[0]) {
    throw new Error(`Image generation failed: ${JSON.stringify(data)}`);
  }

  return {
    url: data.images[0].url,
    seed: data.seed || 0,
  };
}
