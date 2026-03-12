import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Copy, ArrowLeft, BookmarkCheck, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptItem {
  id: string;
  prompt: string;
  category: string;
  created_at: string;
}

export default function SavedPage() {
  const [savedPrompts, setSavedPrompts] = useState<PromptItem[]>([]);
  const [historyPrompts, setHistoryPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    const [savedRes, historyRes] = await Promise.all([
      supabase.from("saved_prompts").select("*").order("created_at", { ascending: false }),
      supabase.from("prompt_history").select("*").order("created_at", { ascending: false }),
    ]);
    if (savedRes.error) toast.error("Failed to load saved prompts");
    else setSavedPrompts(savedRes.data || []);
    if (historyRes.error) toast.error("Failed to load history");
    else setHistoryPrompts(historyRes.data || []);
    setLoading(false);
  };

  const removeSaved = async (id: string) => {
    const { error } = await supabase.from("saved_prompts").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Prompt deleted");
  };

  const removeHistory = async (id: string) => {
    const { error } = await supabase.from("prompt_history").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setHistoryPrompts((prev) => prev.filter((p) => p.id !== id));
    toast.success("History item deleted");
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const renderPromptCard = (p: PromptItem, onDelete: (id: string) => void, index: number) => (
    <motion.div
      key={p.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded bg-secondary px-2 py-0.5 font-display text-xs uppercase text-primary">{p.category}</span>
        <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-foreground">{p.prompt}</p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => copy(p.prompt)} className="gap-1 text-muted-foreground hover:text-foreground">
          <Copy className="h-3.5 w-3.5" /> Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)} className="gap-1 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>
    </motion.div>
  );

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-3xl pb-20 pt-24">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">Your Prompts</h1>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="mb-6 w-full bg-secondary">
            <TabsTrigger value="saved" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookmarkCheck className="h-4 w-4" /> Saved ({savedPrompts.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4" /> History ({historyPrompts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : savedPrompts.length === 0 ? (
              <p className="text-center text-muted-foreground">No saved prompts yet. Generate and save some!</p>
            ) : (
              <div className="space-y-4">
                {savedPrompts.map((p, i) => renderPromptCard(p, removeSaved, i))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : historyPrompts.length === 0 ? (
              <p className="text-center text-muted-foreground">No generation history yet. Start generating prompts!</p>
            ) : (
              <div className="space-y-4">
                {historyPrompts.map((p, i) => renderPromptCard(p, removeHistory, i))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
