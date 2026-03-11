import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Copy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SavedPrompt {
  prompt: string;
  category: string;
  date: string;
}

export default function SavedPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPrompts(JSON.parse(localStorage.getItem("savedPrompts") || "[]"));
  }, []);

  const remove = (index: number) => {
    const updated = prompts.filter((_, i) => i !== index);
    setPrompts(updated);
    localStorage.setItem("savedPrompts", JSON.stringify(updated));
    toast.success("Prompt deleted");
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl pb-20 pt-24">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">Saved Prompts</h1>
        </div>

        {prompts.length === 0 ? (
          <p className="text-center text-muted-foreground">No saved prompts yet. Generate and save some!</p>
        ) : (
          <div className="space-y-4">
            {prompts.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-secondary px-2 py-0.5 font-display text-xs uppercase text-primary">{p.category}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-foreground">{p.prompt}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copy(p.prompt)} className="gap-1 text-muted-foreground hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(i)} className="gap-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
