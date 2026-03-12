import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your email for the reset link!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Prompt<span className="text-gradient-primary">Forge</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="mb-1 text-center font-display text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {sent ? "Check your email for a reset link" : "Enter your email to receive a reset link"}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary font-display text-primary-foreground hover:bg-primary/90">
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
            </p>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
