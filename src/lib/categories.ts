import { Image, Type, Video, Music, UserCircle, LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  glowClass: string;
  route: string;
}

export const categories: Category[] = [
  {
    id: "image",
    title: "Image Generation",
    description: "Create stunning visuals with prompts for Midjourney, DALL·E, Stable Diffusion and more",
    icon: Image,
    color: "text-glow-primary",
    glowClass: "glow-primary",
    route: "/generator/image",
  },
  {
    id: "text",
    title: "Text Generation",
    description: "Craft powerful prompts for ChatGPT, Claude, Gemini and other language models",
    icon: Type,
    color: "text-glow-accent",
    glowClass: "glow-accent",
    route: "/generator/text",
  },
  {
    id: "video",
    title: "Video Generation",
    description: "Generate cinematic video prompts for Sora, Runway, Pika and more",
    icon: Video,
    color: "text-glow-warm",
    glowClass: "",
    route: "/generator/video",
  },
  {
    id: "audio",
    title: "Audio Generation",
    description: "Design audio and music prompts for Suno, Udio, ElevenLabs and others",
    icon: Music,
    color: "text-glow-rose",
    glowClass: "",
    route: "/generator/audio",
  },
  {
    id: "character",
    title: "Character Design",
    description: "Build detailed character prompts with personality, appearance and backstory",
    icon: UserCircle,
    color: "text-glow-green",
    glowClass: "",
    route: "/generator/character",
  },
];
