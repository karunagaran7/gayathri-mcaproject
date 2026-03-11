import { motion } from "framer-motion";
import { Sparkles, Zap, Layers } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px]" />

        <div className="container relative z-10 flex flex-col items-center py-24 text-center lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Prompt Engineering
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl"
          >
            Craft Perfect AI Prompts{" "}
            <span className="text-gradient-primary">Without the Complexity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-muted-foreground"
          >
            Select options visually, and get optimized prompts for Midjourney, DALL·E, ChatGPT, Sora, and more — no prompt engineering skills needed.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 flex gap-8 md:gap-16"
          >
            {[
              { icon: Sparkles, label: "5 Modules", value: "Image · Text · Video · Audio · Character" },
              { icon: Zap, label: "Instant", value: "One-click prompt generation" },
              { icon: Layers, label: "Multi-Platform", value: "20+ AI platforms supported" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <stat.icon className="mb-1 h-4 w-4 text-primary" />
                <span className="font-display text-sm font-semibold text-foreground">{stat.label}</span>
                <span className="max-w-[140px] text-xs text-muted-foreground">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container relative z-10 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-2 text-center font-display text-sm font-medium uppercase tracking-widest text-primary"
        >
          Choose a Module
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-muted-foreground"
        >
          Select a category to start building your prompt
        </motion.p>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <span className="font-display">PromptForge</span> — AI-Powered Smart Prompt Generation System
        </div>
      </footer>
    </div>
  );
};

export default Index;
