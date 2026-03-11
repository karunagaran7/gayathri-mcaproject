export interface PromptOption {
  label: string;
  value: string;
}

export interface PromptField {
  id: string;
  label: string;
  type: "select" | "text" | "chips";
  options?: PromptOption[];
  placeholder?: string;
}

export interface GeneratorConfig {
  id: string;
  title: string;
  description: string;
  fields: PromptField[];
  templateFn: (selections: Record<string, string>) => string;
}

const imageConfig: GeneratorConfig = {
  id: "image",
  title: "Image Prompt Generator",
  description: "Generate optimized prompts for Midjourney, DALL·E, Stable Diffusion",
  fields: [
    {
      id: "subject",
      label: "Subject",
      type: "text",
      placeholder: "e.g. a futuristic city skyline at sunset",
    },
    {
      id: "style",
      label: "Art Style",
      type: "chips",
      options: [
        { label: "Photorealistic", value: "photorealistic" },
        { label: "Digital Art", value: "digital art" },
        { label: "Oil Painting", value: "oil painting style" },
        { label: "Watercolor", value: "watercolor illustration" },
        { label: "Anime", value: "anime style" },
        { label: "3D Render", value: "3D render" },
        { label: "Pixel Art", value: "pixel art" },
        { label: "Sketch", value: "pencil sketch" },
      ],
    },
    {
      id: "mood",
      label: "Mood / Atmosphere",
      type: "chips",
      options: [
        { label: "Cinematic", value: "cinematic lighting" },
        { label: "Dreamy", value: "dreamy ethereal atmosphere" },
        { label: "Dark", value: "dark moody atmosphere" },
        { label: "Vibrant", value: "vibrant colors" },
        { label: "Minimalist", value: "minimalist clean" },
        { label: "Epic", value: "epic dramatic scene" },
      ],
    },
    {
      id: "quality",
      label: "Quality Modifiers",
      type: "chips",
      options: [
        { label: "8K", value: "8k resolution" },
        { label: "Ultra Detail", value: "ultra detailed" },
        { label: "Sharp Focus", value: "sharp focus" },
        { label: "HDR", value: "HDR" },
        { label: "Masterpiece", value: "masterpiece" },
      ],
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "Midjourney", value: "midjourney" },
        { label: "DALL·E", value: "dalle" },
        { label: "Stable Diffusion", value: "stable-diffusion" },
        { label: "Leonardo AI", value: "leonardo" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.subject, s.style, s.mood, s.quality].filter(Boolean);
    const base = parts.join(", ");
    if (s.platform === "midjourney") return `${base} --ar 16:9 --v 6 --q 2`;
    if (s.platform === "stable-diffusion") return `(${base}), best quality, high resolution`;
    return base;
  },
};

const textConfig: GeneratorConfig = {
  id: "text",
  title: "Text Prompt Generator",
  description: "Create effective prompts for ChatGPT, Claude, Gemini",
  fields: [
    {
      id: "task",
      label: "Task Description",
      type: "text",
      placeholder: "e.g. Write a blog post about sustainable living",
    },
    {
      id: "role",
      label: "AI Role",
      type: "chips",
      options: [
        { label: "Expert Writer", value: "You are an expert writer" },
        { label: "Data Analyst", value: "You are a data analyst" },
        { label: "Marketing Guru", value: "You are a marketing expert" },
        { label: "Teacher", value: "You are a patient teacher" },
        { label: "Developer", value: "You are a senior software developer" },
        { label: "Creative Director", value: "You are a creative director" },
      ],
    },
    {
      id: "tone",
      label: "Tone",
      type: "chips",
      options: [
        { label: "Professional", value: "professional tone" },
        { label: "Casual", value: "casual friendly tone" },
        { label: "Academic", value: "academic formal tone" },
        { label: "Persuasive", value: "persuasive compelling tone" },
        { label: "Humorous", value: "witty humorous tone" },
      ],
    },
    {
      id: "format",
      label: "Output Format",
      type: "chips",
      options: [
        { label: "Paragraph", value: "well-structured paragraphs" },
        { label: "Bullet Points", value: "concise bullet points" },
        { label: "Step-by-Step", value: "step-by-step guide" },
        { label: "Table", value: "organized table format" },
        { label: "Code", value: "code with comments" },
      ],
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "ChatGPT", value: "chatgpt" },
        { label: "Claude", value: "claude" },
        { label: "Gemini", value: "gemini" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [
      s.role ? `${s.role}.` : "",
      s.task,
      s.tone ? `Use a ${s.tone}.` : "",
      s.format ? `Format the output as ${s.format}.` : "",
      "Be thorough, accurate, and provide actionable insights.",
    ].filter(Boolean);
    return parts.join(" ");
  },
};

const videoConfig: GeneratorConfig = {
  id: "video",
  title: "Video Prompt Generator",
  description: "Generate prompts for Sora, Runway, Pika Labs",
  fields: [
    {
      id: "scene",
      label: "Scene Description",
      type: "text",
      placeholder: "e.g. A drone shot flying over a neon-lit cyberpunk city at night",
    },
    {
      id: "movement",
      label: "Camera Movement",
      type: "chips",
      options: [
        { label: "Tracking Shot", value: "smooth tracking shot" },
        { label: "Drone Shot", value: "aerial drone shot" },
        { label: "Slow Motion", value: "slow motion" },
        { label: "Zoom In", value: "slow zoom in" },
        { label: "Handheld", value: "handheld camera feel" },
        { label: "Timelapse", value: "timelapse" },
      ],
    },
    {
      id: "style",
      label: "Visual Style",
      type: "chips",
      options: [
        { label: "Cinematic", value: "cinematic 4K" },
        { label: "Documentary", value: "documentary style" },
        { label: "Animation", value: "3D animation" },
        { label: "Retro VHS", value: "retro VHS aesthetic" },
        { label: "Film Noir", value: "black and white film noir" },
      ],
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "Sora", value: "sora" },
        { label: "Runway Gen-3", value: "runway" },
        { label: "Pika Labs", value: "pika" },
      ],
    },
  ],
  templateFn: (s) => {
    return [s.scene, s.movement, s.style].filter(Boolean).join(", ");
  },
};

const audioConfig: GeneratorConfig = {
  id: "audio",
  title: "Audio Prompt Generator",
  description: "Design prompts for Suno, Udio, ElevenLabs",
  fields: [
    {
      id: "description",
      label: "Audio Description",
      type: "text",
      placeholder: "e.g. An upbeat electronic track with dreamy synths",
    },
    {
      id: "genre",
      label: "Genre",
      type: "chips",
      options: [
        { label: "Electronic", value: "electronic" },
        { label: "Lo-Fi", value: "lo-fi hip hop" },
        { label: "Orchestral", value: "orchestral cinematic" },
        { label: "Rock", value: "rock" },
        { label: "Jazz", value: "jazz" },
        { label: "Ambient", value: "ambient" },
        { label: "Pop", value: "pop" },
        { label: "R&B", value: "R&B soul" },
      ],
    },
    {
      id: "mood",
      label: "Mood",
      type: "chips",
      options: [
        { label: "Uplifting", value: "uplifting energetic" },
        { label: "Melancholic", value: "melancholic emotional" },
        { label: "Chill", value: "chill relaxing" },
        { label: "Intense", value: "intense powerful" },
        { label: "Mysterious", value: "mysterious dark" },
      ],
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "Suno", value: "suno" },
        { label: "Udio", value: "udio" },
        { label: "ElevenLabs", value: "elevenlabs" },
      ],
    },
  ],
  templateFn: (s) => {
    return [s.description, s.genre, s.mood].filter(Boolean).join(", ");
  },
};

const characterConfig: GeneratorConfig = {
  id: "character",
  title: "Character Design Prompt",
  description: "Build detailed character descriptions for AI generation",
  fields: [
    {
      id: "name",
      label: "Character Concept",
      type: "text",
      placeholder: "e.g. A cyberpunk bounty hunter with mechanical arms",
    },
    {
      id: "appearance",
      label: "Appearance Style",
      type: "chips",
      options: [
        { label: "Realistic", value: "photorealistic character portrait" },
        { label: "Anime", value: "anime character design" },
        { label: "Fantasy", value: "high fantasy character art" },
        { label: "Sci-Fi", value: "science fiction character concept" },
        { label: "Cartoon", value: "stylized cartoon character" },
        { label: "Chibi", value: "chibi cute character" },
      ],
    },
    {
      id: "pose",
      label: "Pose / View",
      type: "chips",
      options: [
        { label: "Full Body", value: "full body view" },
        { label: "Portrait", value: "portrait bust shot" },
        { label: "Action Pose", value: "dynamic action pose" },
        { label: "Character Sheet", value: "character reference sheet, multiple angles" },
      ],
    },
    {
      id: "details",
      label: "Extra Details",
      type: "chips",
      options: [
        { label: "Detailed Armor", value: "intricate detailed armor" },
        { label: "Glowing Eyes", value: "glowing eyes" },
        { label: "Scars", value: "battle scars" },
        { label: "Tattoos", value: "ornate tattoos" },
        { label: "Wings", value: "large ethereal wings" },
      ],
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "Midjourney", value: "midjourney" },
        { label: "DALL·E", value: "dalle" },
        { label: "Stable Diffusion", value: "stable-diffusion" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.name, s.appearance, s.pose, s.details].filter(Boolean);
    const base = parts.join(", ");
    if (s.platform === "midjourney") return `${base} --ar 2:3 --v 6 --q 2`;
    if (s.platform === "stable-diffusion") return `(${base}), best quality, detailed face`;
    return base;
  },
};

export const generatorConfigs: Record<string, GeneratorConfig> = {
  image: imageConfig,
  text: textConfig,
  video: videoConfig,
  audio: audioConfig,
  character: characterConfig,
};
