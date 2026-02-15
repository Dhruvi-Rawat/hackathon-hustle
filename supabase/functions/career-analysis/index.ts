import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { dreamJob, skills, weeklyHours, interests } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a career analysis AI. Given a user's dream job, current skills, weekly learning hours, and interests, generate a detailed career roadmap.

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "skillTree": [
    {
      "category": "Category Name",
      "skills": [
        { "name": "Skill Name", "level": 3, "required": 5 }
      ]
    }
  ],
  "gapAnalysis": [
    { "skill": "Skill Name", "current": 40, "required": 100, "match": 40 }
  ],
  "timeline": [
    { "month": 1, "title": "Month Title", "tasks": ["Task 1", "Task 2"] }
  ],
  "overallMatch": 45
}

Guidelines:
- level is 0-5 (0=none, 5=expert), based on whether the skill appears in their current skills
- match is a percentage 0-100
- Generate 3-5 skill categories with 3-5 skills each
- Generate 6-8 gap analysis items
- Generate a 6-month timeline with 3-4 tasks per month
- overallMatch is the average of all gap analysis match percentages
- Make it realistic and personalized to the dream job`;

    const userPrompt = `Dream Job: ${dreamJob}
Current Skills: ${skills.join(", ")}
Weekly Learning Hours: ${weeklyHours}
Interests: ${interests.join(", ")}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) throw new Error("No AI response");

    // Parse JSON from response (handle potential markdown fences)
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
