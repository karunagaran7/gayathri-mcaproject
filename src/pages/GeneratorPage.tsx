import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, RefreshCw, BookmarkPlus, Sparkles, Wand2, RotateCcw, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { generatorConfigs } from "@/lib/generatorConfigs";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function GeneratorPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const config = type ? generatorConfigs[type] : null;
  const category = categories.find((c) => c.id === type);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  if (!config || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  const Icon = category.icon;

  // Count filled fields for progress
  const totalFields = config.fields.length;
  const filledFields = config.fields.filter((f) => selections[f.id]?.trim()).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const updateSelection = (fieldId: string, value: string) => {
    setSelections((prev) => {
      const current = prev[fieldId] || "";
      const values = current ? current.split(", ") : [];
      const idx = values.indexOf(value);
      if (idx > -1) values.splice(idx, 1);
      else values.push(value);
      return { ...prev, [fieldId]: values.join(", ") };
    });
  };

  const setSelection = (fieldId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  };

  const generate = () => {
    const prompt = config.templateFn(selections);
    setGeneratedPrompt(prompt);
    setEnhancedPrompt("");
    setShowEnhanced(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const resetAll = () => {
    setSelections({});
    setGeneratedPrompt("");
    setEnhancedPrompt("");
    setShowEnhanced(false);
  };

  const enhanceWithAI = async () => {
    if (!generatedPrompt) return;
    setIsEnhancing(true);
    setEnhancedPrompt("");
    setShowEnhanced(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: generatedPrompt, category: type }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to enhance prompt");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setEnhancedPrompt(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "AI enhancement failed");
      setShowEnhanced(false);
    } finally {
      setIsEnhancing(false);
    }
  };

  const useEnhancedPrompt = () => {
    setGeneratedPrompt(enhancedPrompt);
    setShowEnhanced(false);
    setEnhancedPrompt("");
    toast.success("Enhanced prompt applied!");
  };

  const copyPrompt = async (text?: string) => {
    const toCopy = text || (showEnhanced && enhancedPrompt ? enhancedPrompt : generatedPrompt);
    await navigator.clipboard.writeText(toCopy);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const savePrompt = () => {
    const promptToSave = showEnhanced && enhancedPrompt ? enhancedPrompt : generatedPrompt;
    const saved = JSON.parse(localStorage.getItem("savedPrompts") || "[]");
    saved.push({ prompt: promptToSave, category: type, date: new Date().toISOString() });
    localStorage.setItem("savedPrompts", JSON.stringify(saved));
    toast.success("Prompt saved!");
  };

  const isChipSelected = (fieldId: string, value: string) => {
    const current = selections[fieldId] || "";
    return current.split(", ").includes(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl pb-20 pt-24">
        {/* Back + Title */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-secondary p-2 ${category.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Completion: {filledFields}/{totalFields} fields</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {config.fields.map((field, fieldIndex) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: fieldIndex * 0.04 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-1 flex items-center gap-2">
                <label className="font-display text-sm font-medium text-foreground">{field.label}</label>
                {field.description && (
                  <span className="group relative">
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    <span className="pointer-events-none absolute left-6 top-0 z-50 w-48 rounded-md bg-popover p-2 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {field.description}
                    </span>
                  </span>
                )}
              </div>

              {field.type === "text" && (
                <Input
                  placeholder={field.placeholder}
                  value={selections[field.id] || ""}
                  onChange={(e) => setSelection(field.id, e.target.value)}
                  className="mt-2 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  placeholder={field.placeholder}
                  value={selections[field.id] || ""}
                  onChange={(e) => setSelection(field.id, e.target.value)}
                  className="mt-2 min-h-[80px] border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              )}

              {field.type === "select" && field.options && (
                <Select value={selections[field.id] || ""} onValueChange={(v) => setSelection(field.id, v)}>
                  <SelectTrigger className="mt-2 border-border bg-secondary text-foreground">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "chips" && field.options && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.options.map((opt) => {
                    const selected = isChipSelected(field.id, opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateSelection(field.id, opt.value)}
                        className={`rounded-lg border px-3 py-1.5 font-body text-sm transition-all ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={generate} size="lg" className="gap-2 bg-primary font-display text-primary-foreground hover:bg-primary/90 glow-primary">
            <RefreshCw className="h-4 w-4" />
            Generate Prompt
          </Button>
          <Button onClick={resetAll} variant="outline" size="lg" className="gap-2 font-display">
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* Output */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              ref={outputRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 space-y-4"
            >
              {/* Generated Prompt */}
              <div className="rounded-xl border border-primary/20 bg-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-medium text-primary">Generated Prompt</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={savePrompt} className="gap-1 text-muted-foreground hover:text-foreground">
                      <BookmarkPlus className="h-4 w-4" /> Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyPrompt(generatedPrompt)} className="gap-1 text-muted-foreground hover:text-foreground">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">{generatedPrompt}</p>

                {/* AI Enhance Button */}
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <Button
                    onClick={enhanceWithAI}
                    disabled={isEnhancing}
                    className="gap-2 bg-accent font-display text-accent-foreground hover:bg-accent/90 glow-accent"
                  >
                    {isEnhancing ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    AI will refine and improve your prompt automatically
                  </span>
                </div>
              </div>

              {/* Enhanced Prompt */}
              <AnimatePresence>
                {showEnhanced && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-accent/30 bg-accent/5 p-6"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="font-display text-sm font-medium text-accent">AI Enhanced Prompt</span>
                        {isEnhancing && (
                          <span className="animate-pulse rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                            streaming...
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyPrompt(enhancedPrompt)} className="gap-1 text-muted-foreground hover:text-foreground" disabled={!enhancedPrompt}>
                          <Copy className="h-4 w-4" /> Copy
                        </Button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">
                      {enhancedPrompt || "Generating enhanced prompt..."}
                    </p>
                    {enhancedPrompt && !isEnhancing && (
                      <div className="mt-4 flex gap-3 border-t border-accent/20 pt-4">
                        <Button onClick={useEnhancedPrompt} size="sm" className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90">
                          <Check className="h-3.5 w-3.5" /> Use This Version
                        </Button>
                        <Button onClick={() => { setShowEnhanced(false); setEnhancedPrompt(""); }} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          Discard
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
