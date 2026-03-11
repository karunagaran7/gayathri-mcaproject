import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      image: `You are an expert AI image prompt engineer. Take the user's draft prompt and enhance it to be more detailed, vivid, and effective for AI image generation. Add artistic details, improve composition descriptions, and optimize for the target platform. Return ONLY the enhanced prompt text, nothing else.`,
      text: `You are an expert prompt engineer for text-based AI models. Take the user's draft prompt and enhance it to be clearer, more specific, and more likely to produce high-quality results. Improve the role definition, add constraints, and optimize the structure. Return ONLY the enhanced prompt text, nothing else.`,
      video: `You are an expert AI video prompt engineer. Take the user's draft prompt and enhance it with more cinematic details, better camera movement descriptions, and richer visual storytelling. Return ONLY the enhanced prompt text, nothing else.`,
      audio: `You are an expert AI music/audio prompt engineer. Take the user's draft prompt and enhance it with richer musical descriptions, better genre blending, instrument details, and production quality terms. Return ONLY the enhanced prompt text, nothing else.`,
      character: `You are an expert AI character design prompt engineer. Take the user's draft prompt and enhance it with more detailed physical descriptions, richer visual storytelling, and better composition. Return ONLY the enhanced prompt text, nothing else.`,
    };

    const systemPrompt = systemPrompts[category] || systemPrompts.image;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Enhance this prompt:\n\n${prompt}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("enhance-prompt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
