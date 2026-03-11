import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Category } from "@/lib/categories";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = category.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(category.route)}
      className="group relative rounded-xl border border-border bg-card p-6 text-left transition-all duration-300 hover:border-primary/30 hover:bg-secondary/50"
    >
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "var(--gradient-card-hover)" }} />
      <div className="relative z-10">
        <div className={`mb-4 inline-flex rounded-lg bg-secondary p-3 ${category.color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{category.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
      </div>
    </motion.button>
  );
}
