import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Briefcase, Code, Clock, Heart, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/ParticleBackground";

const SKILL_OPTIONS = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "Java", "C++", "TypeScript",
  "HTML/CSS", "Data Analysis", "Machine Learning", "UI/UX Design", "Project Management",
  "Communication", "Leadership", "Problem Solving", "Git", "Cloud Computing", "DevOps", "Mobile Dev",
];

const INTEREST_OPTIONS = [
  { label: "🎨 Creative & Design", value: "creative" },
  { label: "📊 Data & Analytics", value: "data" },
  { label: "🤖 AI & Machine Learning", value: "ai" },
  { label: "🌐 Web Development", value: "web" },
  { label: "📱 Mobile Apps", value: "mobile" },
  { label: "☁️ Cloud & DevOps", value: "cloud" },
  { label: "🔒 Cybersecurity", value: "security" },
  { label: "🎮 Game Development", value: "gaming" },
];

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [dreamJob, setDreamJob] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [hours, setHours] = useState(10);
  const [interests, setInterests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/auth");
    };
    checkAuth();
  }, [navigate]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Save quiz response
      const { data: quizData, error: quizError } = await supabase
        .from("quiz_responses")
        .insert({
          user_id: session.user.id,
          dream_job: dreamJob,
          skills,
          weekly_hours: hours,
          interests,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Call AI edge function
      const { data: aiData, error: aiError } = await supabase.functions.invoke("career-analysis", {
        body: { dreamJob, skills, weeklyHours: hours, interests, quizResponseId: quizData.id },
      });

      if (aiError) throw aiError;

      // Save roadmap
      await supabase.from("roadmaps").insert({
        user_id: session.user.id,
        quiz_response_id: quizData.id,
        roadmap_data: aiData,
      });

      // Create initial achievements
      const achievementsList = [
        { achievement_name: "First Step", description: "Completed career quiz", icon: "🎯", unlocked: true, unlocked_at: new Date().toISOString() },
        { achievement_name: "Skill Scanner", description: "Identified your current skills", icon: "🔍", unlocked: true, unlocked_at: new Date().toISOString() },
        { achievement_name: "Pathfinder", description: "Generated your career roadmap", icon: "🗺️", unlocked: true, unlocked_at: new Date().toISOString() },
        { achievement_name: "Week 1 Warrior", description: "Complete first week of learning", icon: "⚔️", unlocked: false },
        { achievement_name: "Skill Master", description: "Master 5 new skills", icon: "🏆", unlocked: false },
        { achievement_name: "Streak Legend", description: "7-day learning streak", icon: "🔥", unlocked: false },
      ];

      await supabase.from("achievements").insert(
        achievementsList.map((a) => ({ ...a, user_id: session.user.id }))
      );

      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setSubmitting(false);
    }
  };

  const steps = [
    { icon: Briefcase, title: "Dream Job", subtitle: "What's your dream career?" },
    { icon: Code, title: "Your Skills", subtitle: "Select your current skills" },
    { icon: Clock, title: "Time Available", subtitle: "How many hours per week can you learn?" },
    { icon: Heart, title: "Interests", subtitle: "What areas excite you?" },
  ];

  const canProceed = () => {
    if (step === 0) return dreamJob.trim().length > 0;
    if (step === 1) return skills.length > 0;
    if (step === 2) return true;
    if (step === 3) return interests.length > 0;
    return false;
  };

  if (submitting) {
    return (
      <div className="min-h-screen ocean-gradient flex items-center justify-center">
        <ParticleBackground />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 text-center"
        >
          <div className="relative mx-auto mb-6 h-24 w-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary/60 border-l-primary/60"
            />
            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">Analyzing Your Career DNA</h2>
          <p className="text-muted-foreground">AI is building your personalized roadmap...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ocean-gradient relative">
      <ParticleBackground />
      <div className="relative z-10 px-4 py-8 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                animate={{ scale: i === step ? 1.2 : 1 }}
                className={`h-3 w-3 rounded-full transition-colors ${
                  i <= step ? "bg-primary animate-pulse-glow" : "bg-muted"
                }`}
              />
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-primary" />; })()}
              <div>
                <h2 className="font-display text-xl font-bold">{steps[step].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
              </div>
            </div>

            {/* Step 0: Dream Job */}
            {step === 0 && (
              <div>
                <input
                  type="text"
                  placeholder="e.g., Full Stack Developer, Data Scientist, UX Designer..."
                  value={dreamJob}
                  onChange={(e) => setDreamJob(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            )}

            {/* Step 1: Skills */}
            {step === 1 && (
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <motion.button
                    key={skill}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      skills.includes(skill)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Step 2: Hours */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="font-display text-5xl font-bold gradient-text">{hours}</span>
                  <p className="text-muted-foreground mt-1">hours per week</p>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                  style={{ accentColor: "hsl(187 85% 43%)" }}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 hr</span>
                  <span>40 hrs</span>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <motion.button
                    key={interest.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleInterest(interest.value)}
                    className={`glass-card-hover p-4 text-left text-sm font-medium transition-all ${
                      interests.includes(interest.value) ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    {interest.label}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="glow-button flex items-center gap-1 text-sm disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="glow-button flex items-center gap-1 text-sm disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> Generate Roadmap
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
