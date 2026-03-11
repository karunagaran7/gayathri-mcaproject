import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, RefreshCw, BookmarkPlus } from "lucide-react";
import { Header } from "@/components/Header";
import { generatorConfigs } from "@/lib/generatorConfigs";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function GeneratorPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const config = type ? generatorConfigs[type] : null;
  const category = categories.find((c) => c.id === type);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  if (!config || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Module not found</p>
      </div>
    );
  }

  const Icon = category.icon;

  const updateSelection = (fieldId: string, value: string) => {
    setSelections((prev) => {
      // For chips, toggle
      const current = prev[fieldId] || "";
      const values = current ? current.split(", ") : [];
      const idx = values.indexOf(value);
      if (idx > -1) {
        values.splice(idx, 1);
      } else {
        values.push(value);
      }
      return { ...prev, [fieldId]: values.join(", ") };
    });
  };

  const setSelection = (fieldId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  };

  const generate = () => {
    const prompt = config.templateFn(selections);
    setGeneratedPrompt(prompt);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const savePrompt = () => {
    const saved = JSON.parse(localStorage.getItem("savedPrompts") || "[]");
    saved.push({ prompt: generatedPrompt, category: type, date: new Date().toISOString() });
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
        <div className="mb-8 flex items-center gap-4">
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

        {/* Fields */}
        <div className="space-y-6">
          {config.fields.map((field) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <label className="mb-3 block font-display text-sm font-medium text-foreground">{field.label}</label>

              {field.type === "text" && (
                <Input
                  placeholder={field.placeholder}
                  value={selections[field.id] || ""}
                  onChange={(e) => setSelection(field.id, e.target.value)}
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              )}

              {field.type === "select" && field.options && (
                <Select value={selections[field.id] || ""} onValueChange={(v) => setSelection(field.id, v)}>
                  <SelectTrigger className="border-border bg-secondary text-foreground">
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
                <div className="flex flex-wrap gap-2">
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

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={generate} size="lg" className="gap-2 bg-primary font-display text-primary-foreground hover:bg-primary/90 glow-primary">
            <RefreshCw className="h-4 w-4" />
            Generate Prompt
          </Button>
        </div>

        {/* Output */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 rounded-xl border border-primary/20 bg-card p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-sm font-medium text-primary">Generated Prompt</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={savePrompt} className="gap-1 text-muted-foreground hover:text-foreground">
                    <BookmarkPlus className="h-4 w-4" /> Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyPrompt} className="gap-1 text-muted-foreground hover:text-foreground">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground">{generatedPrompt}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
