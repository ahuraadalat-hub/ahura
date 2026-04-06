import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface PhotoPrompt {
  scene_type: string;
  prompt: string;
  description: string;
}

export async function analyzeSelfiAndGeneratePrompts(
  selfieBase64: string,
  platform: "tinder" | "hinge" | "both",
  gender: string | null,
  stylePreference: string | null
): Promise<PhotoPrompt[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-05-06" });

  const platformContext =
    platform === "tinder"
      ? "Tinder (casual, fun, adventurous vibes)"
      : platform === "hinge"
        ? "Hinge (relationship-focused, genuine, thoughtful)"
        : "both Tinder and Hinge (versatile mix of fun and genuine)";

  const genderContext = gender ? `The person identifies as ${gender}.` : "";
  const styleContext = stylePreference
    ? `Style preference: ${stylePreference}.`
    : "";

  const systemPrompt = `You are an expert dating profile photographer and stylist. Analyze the selfie provided and generate exactly 6 diverse, high-quality image generation prompts that will create stunning dating profile photos for ${platformContext}.

${genderContext}
${styleContext}

Each prompt must:
1. Maintain the person's exact facial features, skin tone, hair color/style, and distinguishing characteristics
2. Place them in different attractive, aspirational settings
3. Use professional photography language (lighting, composition, lens details)
4. Be optimized for the image generation model (detailed, specific, cinematic)

Generate these 6 specific scene types:
1. "hero" - The main profile photo: confident, well-lit headshot/upper body in an attractive urban or natural setting
2. "adventure" - Outdoor/travel: hiking, beach, exploring a city, or doing something active and fun
3. "social" - At a nice restaurant, rooftop bar, coffee shop, or social gathering looking approachable
4. "passion" - Engaged in an interesting hobby or activity (cooking, music, art, sports, reading)
5. "dressy" - Dressed up for a night out, formal event, or looking polished and put-together
6. "candid" - A natural, laughing, genuine moment that shows personality and warmth

Return ONLY valid JSON array with exactly 6 objects, each having:
- "scene_type": one of the types above
- "prompt": the full detailed image generation prompt (must start with "Professional photograph of [physical description matching the selfie]...")
- "description": a short 5-7 word description of the scene for the UI

Example format:
[{"scene_type":"hero","prompt":"Professional photograph of...","description":"Confident city portrait at golden hour"}]`;

  const result = await model.generateContent([
    { text: systemPrompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: selfieBase64,
      },
    },
  ]);

  const responseText = result.response.text();

  // Extract JSON from the response
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  const prompts: PhotoPrompt[] = JSON.parse(jsonMatch[0]);

  if (prompts.length !== 6) {
    throw new Error(`Expected 6 prompts, got ${prompts.length}`);
  }

  return prompts;
}
