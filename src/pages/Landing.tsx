import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp, Zap, Users, BookOpen, Award, ArrowRight, ChevronDown, Brain, Layers, BarChart3 } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import DNAHelix from "@/components/DNAHelix";
import WaveDivider from "@/components/WaveDivider";
import AnimatedCounter from "@/components/AnimatedCounter";

const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const steps = [
    { icon: Target, title: "Enter Your Dream Job", desc: "Tell us your career aspirations and where you envision yourself", color: "from-primary to-aqua-light" },
    { icon: Brain, title: "AI Analyzes Your Path", desc: "Our AI engine maps skill gaps and builds a personalized roadmap", color: "from-aqua-light to-teal-accent" },
    { icon: TrendingUp, title: "Follow & Level Up", desc: "Track progress with gamified milestones and achievements", color: "from-teal-accent to-primary" },
  ];

  const features = [
    { icon: Layers, title: "Interactive Skill Tree", desc: "Visual node-graph showing your skill ecosystem and growth areas" },
    { icon: BarChart3, title: "Gap Analysis", desc: "Precise percentage match scores for every required skill" },
    { icon: BookOpen, title: "Monthly Learning Plan", desc: "Week-by-week structured roadmap tailored to your availability" },
    { icon: Award, title: "Gamified Progress", desc: "Unlock achievements, earn XP, and maintain learning streaks" },
  ];

  const stats = [
    { value: 50, suffix: "+", label: "Career Paths" },
    { value: 200, suffix: "+", label: "Skills Mapped" },
    { value: 98, suffix: "%", label: "Accuracy Rate" },
    { value: 10, suffix: "k+", label: "Users Guided" },
  ];

  return (
    <div className="min-h-screen ocean-gradient relative overflow-hidden">
      <ParticleBackground />

      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-[10%] h-64 w-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(187 85% 43%), transparent)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-40 right-[15%] h-80 w-80 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, hsl(185 70% 55%), transparent)" }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm border-b border-border/20"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Sparkles className="h-7 w-7 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
          </div>
          <span className="font-display text-xl font-bold gradient-text">CareerDNA</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="hidden sm:flex glow-button !px-5 !py-2 text-sm"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center px-6 pt-16 pb-8 md:pt-24 md:pb-16 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-sm text-primary">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                AI-Powered Career Intelligence
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl md:leading-tight"
            >
              Discover Your{" "}
              <span className="relative">
                <span className="gradient-text">Career DNA</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary via-aqua-light to-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed"
            >
              Enter your dream job, and our AI builds a{" "}
              <span className="text-foreground font-medium">personalized skill tree</span>,{" "}
              <span className="text-foreground font-medium">gap analysis</span>, and{" "}
              <span className="text-foreground font-medium">month-by-month roadmap</span>—crafted just for you.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(187 85% 43% / 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/auth")}
                className="glow-button text-lg font-display flex items-center justify-center gap-2"
              >
                Start Your Journey <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-border/50 px-8 py-4 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More <ChevronDown className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right: DNA Helix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block flex-shrink-0"
          >
            <DNAHelix />
          </motion.div>
        </div>
      </motion.div>

      {/* Wave divider */}
      <WaveDivider />

      {/* Stats Section */}
      <div className="relative z-10 py-16 md:py-20 px-6 md:px-12 bg-secondary/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <WaveDivider flip />

      {/* How it works */}
      <div className="relative z-10 px-6 py-20 md:py-28 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-4">
            Simple Process
          </div>
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Three simple steps to unlock your personalized career intelligence
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card p-8 text-center relative group"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-10`}
                  style={{ background: `linear-gradient(135deg, hsl(187 85% 43% / 0.15), hsl(185 70% 55% / 0.08))` }}
                >
                  <step.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Step {i + 1}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>

              {/* Connector arrow for desktop */}
              {i < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <WaveDivider />

      {/* Features Section */}
      <div className="relative z-10 px-6 py-20 md:py-28 md:px-12 bg-secondary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-4">
            Powerful Features
          </div>
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A comprehensive toolkit to navigate your career transformation
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card-hover p-6 flex gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <WaveDivider flip />

      {/* CTA Section */}
      <div className="relative z-10 px-6 py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          <h2 className="font-display text-3xl font-bold md:text-5xl mb-6">
            Ready to Decode Your <span className="gradient-text">Career DNA</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of professionals who've discovered their optimal career path using AI-powered analysis.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px hsl(187 85% 43% / 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/auth")}
            className="glow-button text-lg font-display"
          >
            Start Free Analysis →
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-display text-sm font-semibold gradient-text">CareerDNA</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built with 🧬 for Talentine Hackathon · AI-Powered Career Intelligence
        </p>
      </footer>
    </div>
  );
};

export default Landing;
