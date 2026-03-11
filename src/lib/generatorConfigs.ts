export interface PromptOption {
  label: string;
  value: string;
}

export interface PromptField {
  id: string;
  label: string;
  type: "select" | "text" | "chips" | "textarea";
  options?: PromptOption[];
  placeholder?: string;
  description?: string;
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
      description: "Describe the main subject of your image",
    },
    {
      id: "style",
      label: "Art Style",
      type: "chips",
      description: "Choose one or more artistic styles",
      options: [
        { label: "Photorealistic", value: "photorealistic" },
        { label: "Digital Art", value: "digital art" },
        { label: "Oil Painting", value: "oil painting style" },
        { label: "Watercolor", value: "watercolor illustration" },
        { label: "Anime", value: "anime style" },
        { label: "3D Render", value: "3D render" },
        { label: "Pixel Art", value: "pixel art" },
        { label: "Sketch", value: "pencil sketch" },
        { label: "Surrealism", value: "surrealist art" },
        { label: "Pop Art", value: "pop art style" },
        { label: "Art Nouveau", value: "art nouveau style" },
        { label: "Impressionist", value: "impressionist painting" },
        { label: "Cyberpunk", value: "cyberpunk aesthetic" },
        { label: "Steampunk", value: "steampunk style" },
        { label: "Vaporwave", value: "vaporwave aesthetic" },
        { label: "Isometric", value: "isometric illustration" },
      ],
    },
    {
      id: "mood",
      label: "Mood / Atmosphere",
      type: "chips",
      description: "Set the emotional tone of the image",
      options: [
        { label: "Cinematic", value: "cinematic lighting" },
        { label: "Dreamy", value: "dreamy ethereal atmosphere" },
        { label: "Dark", value: "dark moody atmosphere" },
        { label: "Vibrant", value: "vibrant colors" },
        { label: "Minimalist", value: "minimalist clean" },
        { label: "Epic", value: "epic dramatic scene" },
        { label: "Nostalgic", value: "nostalgic warm tones" },
        { label: "Mysterious", value: "mysterious foggy atmosphere" },
        { label: "Serene", value: "serene peaceful ambiance" },
        { label: "Chaotic", value: "chaotic dynamic energy" },
      ],
    },
    {
      id: "lighting",
      label: "Lighting",
      type: "chips",
      description: "Specify the lighting style",
      options: [
        { label: "Golden Hour", value: "golden hour lighting" },
        { label: "Neon", value: "neon lighting" },
        { label: "Studio", value: "studio lighting" },
        { label: "Backlit", value: "backlit silhouette" },
        { label: "Rim Light", value: "rim lighting" },
        { label: "Volumetric", value: "volumetric god rays" },
        { label: "Moonlight", value: "soft moonlight" },
        { label: "Natural", value: "natural ambient light" },
      ],
    },
    {
      id: "composition",
      label: "Composition",
      type: "chips",
      description: "Choose framing and composition",
      options: [
        { label: "Close-up", value: "close-up shot" },
        { label: "Wide Angle", value: "wide angle shot" },
        { label: "Bird's Eye", value: "bird's eye view" },
        { label: "Low Angle", value: "low angle dramatic" },
        { label: "Rule of Thirds", value: "rule of thirds composition" },
        { label: "Symmetrical", value: "symmetrical composition" },
        { label: "Panoramic", value: "panoramic view" },
      ],
    },
    {
      id: "colorPalette",
      label: "Color Palette",
      type: "chips",
      description: "Define the color scheme",
      options: [
        { label: "Warm Tones", value: "warm color palette" },
        { label: "Cool Tones", value: "cool blue palette" },
        { label: "Monochrome", value: "monochromatic" },
        { label: "Pastel", value: "soft pastel colors" },
        { label: "Earth Tones", value: "earthy natural colors" },
        { label: "Neon", value: "neon bright colors" },
        { label: "Muted", value: "muted desaturated tones" },
      ],
    },
    {
      id: "quality",
      label: "Quality Modifiers",
      type: "chips",
      description: "Add quality boosters",
      options: [
        { label: "8K", value: "8k resolution" },
        { label: "Ultra Detail", value: "ultra detailed" },
        { label: "Sharp Focus", value: "sharp focus" },
        { label: "HDR", value: "HDR" },
        { label: "Masterpiece", value: "masterpiece" },
        { label: "Award Winning", value: "award winning photography" },
        { label: "Highly Detailed", value: "highly detailed intricate" },
        { label: "Octane Render", value: "octane render" },
        { label: "Unreal Engine", value: "unreal engine 5" },
      ],
    },
    {
      id: "aspectRatio",
      label: "Aspect Ratio",
      type: "select",
      description: "Choose the output dimensions",
      options: [
        { label: "16:9 (Landscape)", value: "16:9" },
        { label: "9:16 (Portrait)", value: "9:16" },
        { label: "1:1 (Square)", value: "1:1" },
        { label: "4:3 (Classic)", value: "4:3" },
        { label: "2:3 (Portrait)", value: "2:3" },
        { label: "3:2 (Landscape)", value: "3:2" },
        { label: "21:9 (Ultra-wide)", value: "21:9" },
      ],
    },
    {
      id: "negativePrompt",
      label: "Negative Prompt (what to avoid)",
      type: "textarea",
      placeholder: "e.g. blurry, low quality, distorted faces, extra limbs",
      description: "Describe what you don't want in the image",
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
        { label: "Flux", value: "flux" },
        { label: "Ideogram", value: "ideogram" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.subject, s.style, s.mood, s.lighting, s.composition, s.colorPalette, s.quality].filter(Boolean);
    const base = parts.join(", ");
    const ar = s.aspectRatio || "16:9";
    let prompt = base;
    if (s.platform === "midjourney") prompt = `${base} --ar ${ar} --v 6 --q 2`;
    else if (s.platform === "stable-diffusion") prompt = `(${base}), best quality, high resolution`;
    else prompt = base;
    if (s.negativePrompt) {
      if (s.platform === "stable-diffusion") prompt += `\n\nNegative prompt: ${s.negativePrompt}`;
      else if (s.platform === "midjourney") prompt += ` --no ${s.negativePrompt}`;
      else prompt += `\n\nAvoid: ${s.negativePrompt}`;
    }
    return prompt;
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
      type: "textarea",
      placeholder: "e.g. Write a blog post about sustainable living tips for beginners",
      description: "Describe what you want the AI to do",
    },
    {
      id: "role",
      label: "AI Role",
      type: "chips",
      description: "Who should the AI pretend to be?",
      options: [
        { label: "Expert Writer", value: "You are an expert writer" },
        { label: "Data Analyst", value: "You are a data analyst" },
        { label: "Marketing Guru", value: "You are a marketing expert" },
        { label: "Teacher", value: "You are a patient teacher" },
        { label: "Developer", value: "You are a senior software developer" },
        { label: "Creative Director", value: "You are a creative director" },
        { label: "Researcher", value: "You are a meticulous researcher" },
        { label: "Storyteller", value: "You are a compelling storyteller" },
        { label: "Business Consultant", value: "You are a seasoned business consultant" },
        { label: "Life Coach", value: "You are a motivational life coach" },
        { label: "Legal Advisor", value: "You are a legal advisor" },
        { label: "UX Designer", value: "You are a UX design expert" },
      ],
    },
    {
      id: "tone",
      label: "Tone",
      type: "chips",
      description: "Set the writing style",
      options: [
        { label: "Professional", value: "professional tone" },
        { label: "Casual", value: "casual friendly tone" },
        { label: "Academic", value: "academic formal tone" },
        { label: "Persuasive", value: "persuasive compelling tone" },
        { label: "Humorous", value: "witty humorous tone" },
        { label: "Empathetic", value: "empathetic understanding tone" },
        { label: "Authoritative", value: "authoritative confident tone" },
        { label: "Conversational", value: "conversational engaging tone" },
      ],
    },
    {
      id: "format",
      label: "Output Format",
      type: "chips",
      description: "How should the response be structured?",
      options: [
        { label: "Paragraph", value: "well-structured paragraphs" },
        { label: "Bullet Points", value: "concise bullet points" },
        { label: "Step-by-Step", value: "step-by-step guide" },
        { label: "Table", value: "organized table format" },
        { label: "Code", value: "code with comments" },
        { label: "Q&A", value: "question and answer format" },
        { label: "Checklist", value: "actionable checklist" },
        { label: "Essay", value: "structured essay format" },
      ],
    },
    {
      id: "length",
      label: "Response Length",
      type: "select",
      description: "How long should the response be?",
      options: [
        { label: "Brief (100-200 words)", value: "Keep the response brief, around 100-200 words" },
        { label: "Medium (300-500 words)", value: "Provide a medium-length response of 300-500 words" },
        { label: "Detailed (800-1200 words)", value: "Write a detailed response of 800-1200 words" },
        { label: "Comprehensive (1500+ words)", value: "Write a comprehensive, in-depth response of 1500+ words" },
      ],
    },
    {
      id: "audience",
      label: "Target Audience",
      type: "chips",
      description: "Who is the content for?",
      options: [
        { label: "Beginners", value: "Target audience: beginners with no prior knowledge" },
        { label: "Intermediate", value: "Target audience: intermediate-level readers" },
        { label: "Experts", value: "Target audience: subject matter experts" },
        { label: "General Public", value: "Target audience: general public" },
        { label: "Students", value: "Target audience: students" },
        { label: "Business Leaders", value: "Target audience: business executives" },
      ],
    },
    {
      id: "constraints",
      label: "Additional Instructions",
      type: "textarea",
      placeholder: "e.g. Include real-world examples, avoid jargon, cite sources",
      description: "Any specific requirements or constraints",
    },
    {
      id: "platform",
      label: "Target Platform",
      type: "select",
      options: [
        { label: "ChatGPT", value: "chatgpt" },
        { label: "Claude", value: "claude" },
        { label: "Gemini", value: "gemini" },
        { label: "Llama", value: "llama" },
        { label: "Mistral", value: "mistral" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [
      s.role ? `${s.role}.` : "",
      s.task,
      s.tone ? `Use a ${s.tone}.` : "",
      s.format ? `Format the output as ${s.format}.` : "",
      s.length || "",
      s.audience || "",
      s.constraints || "",
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
      type: "textarea",
      placeholder: "e.g. A drone shot flying over a neon-lit cyberpunk city at night with flying cars",
      description: "Describe the video scene in detail",
    },
    {
      id: "movement",
      label: "Camera Movement",
      type: "chips",
      description: "How should the camera move?",
      options: [
        { label: "Tracking Shot", value: "smooth tracking shot" },
        { label: "Drone Shot", value: "aerial drone shot" },
        { label: "Slow Motion", value: "slow motion" },
        { label: "Zoom In", value: "slow zoom in" },
        { label: "Zoom Out", value: "gradual zoom out" },
        { label: "Handheld", value: "handheld camera feel" },
        { label: "Timelapse", value: "timelapse" },
        { label: "Dolly", value: "smooth dolly movement" },
        { label: "Pan Left/Right", value: "smooth panning shot" },
        { label: "Orbit", value: "orbiting camera movement" },
        { label: "Static", value: "static locked camera" },
        { label: "First Person", value: "first person POV" },
      ],
    },
    {
      id: "style",
      label: "Visual Style",
      type: "chips",
      description: "Choose the visual aesthetic",
      options: [
        { label: "Cinematic", value: "cinematic 4K" },
        { label: "Documentary", value: "documentary style" },
        { label: "Animation", value: "3D animation" },
        { label: "Retro VHS", value: "retro VHS aesthetic" },
        { label: "Film Noir", value: "black and white film noir" },
        { label: "Music Video", value: "stylized music video" },
        { label: "Commercial", value: "high-end commercial look" },
        { label: "Anime", value: "anime animation style" },
        { label: "Stop Motion", value: "stop motion animation" },
      ],
    },
    {
      id: "duration",
      label: "Duration",
      type: "select",
      description: "How long should the video be?",
      options: [
        { label: "3 seconds", value: "3 seconds" },
        { label: "5 seconds", value: "5 seconds" },
        { label: "10 seconds", value: "10 seconds" },
        { label: "15 seconds", value: "15 seconds" },
      ],
    },
    {
      id: "transition",
      label: "Transitions / Effects",
      type: "chips",
      description: "Add special effects",
      options: [
        { label: "Seamless Loop", value: "seamless looping" },
        { label: "Morph", value: "morphing transition" },
        { label: "Glitch", value: "glitch effect" },
        { label: "Light Leak", value: "film light leaks" },
        { label: "Particles", value: "floating particles" },
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
        { label: "Kling AI", value: "kling" },
        { label: "Luma Dream Machine", value: "luma" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.scene, s.movement, s.style, s.transition].filter(Boolean);
    let prompt = parts.join(", ");
    if (s.duration) prompt += `. Duration: ${s.duration}`;
    return prompt;
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
      type: "textarea",
      placeholder: "e.g. An upbeat electronic track with dreamy synths and a driving bass line",
      description: "Describe the sound or music you want",
    },
    {
      id: "genre",
      label: "Genre",
      type: "chips",
      description: "Choose one or more genres",
      options: [
        { label: "Electronic", value: "electronic" },
        { label: "Lo-Fi", value: "lo-fi hip hop" },
        { label: "Orchestral", value: "orchestral cinematic" },
        { label: "Rock", value: "rock" },
        { label: "Jazz", value: "jazz" },
        { label: "Ambient", value: "ambient" },
        { label: "Pop", value: "pop" },
        { label: "R&B", value: "R&B soul" },
        { label: "Classical", value: "classical" },
        { label: "Metal", value: "heavy metal" },
        { label: "Country", value: "country" },
        { label: "Reggae", value: "reggae" },
        { label: "Trap", value: "trap beat" },
        { label: "Indie", value: "indie folk" },
      ],
    },
    {
      id: "mood",
      label: "Mood",
      type: "chips",
      description: "Set the emotional tone",
      options: [
        { label: "Uplifting", value: "uplifting energetic" },
        { label: "Melancholic", value: "melancholic emotional" },
        { label: "Chill", value: "chill relaxing" },
        { label: "Intense", value: "intense powerful" },
        { label: "Mysterious", value: "mysterious dark" },
        { label: "Romantic", value: "romantic tender" },
        { label: "Triumphant", value: "triumphant epic" },
        { label: "Nostalgic", value: "nostalgic retro" },
      ],
    },
    {
      id: "instruments",
      label: "Instruments",
      type: "chips",
      description: "Specify featured instruments",
      options: [
        { label: "Piano", value: "piano" },
        { label: "Guitar", value: "electric guitar" },
        { label: "Synth", value: "synthesizer" },
        { label: "Drums", value: "drums percussion" },
        { label: "Strings", value: "string ensemble" },
        { label: "Brass", value: "brass section" },
        { label: "Bass", value: "deep bass" },
        { label: "Vocal Chops", value: "vocal chops" },
      ],
    },
    {
      id: "tempo",
      label: "Tempo",
      type: "select",
      description: "Set the speed of the track",
      options: [
        { label: "Slow (60-80 BPM)", value: "slow tempo 70 BPM" },
        { label: "Medium (100-120 BPM)", value: "medium tempo 110 BPM" },
        { label: "Fast (130-150 BPM)", value: "fast tempo 140 BPM" },
        { label: "Very Fast (160+ BPM)", value: "very fast tempo 170 BPM" },
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
        { label: "Stable Audio", value: "stable-audio" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.description, s.genre, s.mood, s.instruments, s.tempo].filter(Boolean);
    return parts.join(", ");
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
      type: "textarea",
      placeholder: "e.g. A cyberpunk bounty hunter with mechanical arms and glowing red eyes, wearing a tattered coat",
      description: "Describe the character in detail",
    },
    {
      id: "appearance",
      label: "Appearance Style",
      type: "chips",
      description: "Choose the visual style",
      options: [
        { label: "Realistic", value: "photorealistic character portrait" },
        { label: "Anime", value: "anime character design" },
        { label: "Fantasy", value: "high fantasy character art" },
        { label: "Sci-Fi", value: "science fiction character concept" },
        { label: "Cartoon", value: "stylized cartoon character" },
        { label: "Chibi", value: "chibi cute character" },
        { label: "Comic Book", value: "comic book art style" },
        { label: "Medieval", value: "medieval character design" },
        { label: "Cyberpunk", value: "cyberpunk character art" },
        { label: "Steampunk", value: "steampunk character design" },
      ],
    },
    {
      id: "pose",
      label: "Pose / View",
      type: "chips",
      description: "Choose how the character is presented",
      options: [
        { label: "Full Body", value: "full body view" },
        { label: "Portrait", value: "portrait bust shot" },
        { label: "Action Pose", value: "dynamic action pose" },
        { label: "Character Sheet", value: "character reference sheet, multiple angles" },
        { label: "3/4 View", value: "three quarter view" },
        { label: "Back View", value: "back view showing details" },
        { label: "Sitting", value: "sitting relaxed pose" },
      ],
    },
    {
      id: "details",
      label: "Extra Details",
      type: "chips",
      description: "Add character features",
      options: [
        { label: "Detailed Armor", value: "intricate detailed armor" },
        { label: "Glowing Eyes", value: "glowing eyes" },
        { label: "Scars", value: "battle scars" },
        { label: "Tattoos", value: "ornate tattoos" },
        { label: "Wings", value: "large ethereal wings" },
        { label: "Horns", value: "demonic horns" },
        { label: "Halo", value: "ethereal halo" },
        { label: "Mechanical Parts", value: "cybernetic mechanical parts" },
        { label: "Magic Aura", value: "magical glowing aura" },
        { label: "Weapon", value: "holding a unique weapon" },
      ],
    },
    {
      id: "expression",
      label: "Expression / Emotion",
      type: "chips",
      description: "Set the character's expression",
      options: [
        { label: "Confident", value: "confident smirk" },
        { label: "Fierce", value: "fierce battle-ready expression" },
        { label: "Calm", value: "calm serene expression" },
        { label: "Mysterious", value: "mysterious enigmatic look" },
        { label: "Joyful", value: "joyful bright smile" },
        { label: "Dark", value: "dark intimidating gaze" },
      ],
    },
    {
      id: "background",
      label: "Background",
      type: "chips",
      description: "Choose a background setting",
      options: [
        { label: "Transparent", value: "plain transparent background" },
        { label: "Abstract", value: "abstract gradient background" },
        { label: "Scene", value: "environmental scene background" },
        { label: "Studio", value: "clean studio backdrop" },
        { label: "Battle", value: "epic battlefield background" },
        { label: "Nature", value: "lush nature environment" },
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
        { label: "Flux", value: "flux" },
      ],
    },
  ],
  templateFn: (s) => {
    const parts = [s.name, s.appearance, s.pose, s.details, s.expression, s.background].filter(Boolean);
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
