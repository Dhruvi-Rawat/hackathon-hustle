import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Target, Calendar, TrendingUp, Star, Zap, Award, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/ParticleBackground";

interface RoadmapData {
  skillTree: { category: string; skills: { name: string; level: number; required: number }[] }[];
  gapAnalysis: { skill: string; current: number; required: number; match: number }[];
  timeline: { month: number; title: string; tasks: string[] }[];
  overallMatch: number;
}

const Dashboard = () => {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tree");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const [roadmapRes, achieveRes] = await Promise.all([
        supabase.from("roadmaps").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(1).single(),
        supabase.from("achievements").select("*").eq("user_id", session.user.id),
      ]);

      if (roadmapRes.data) setRoadmap(roadmapRes.data.roadmap_data as unknown as RoadmapData);
      if (achieveRes.data) setAchievements(achieveRes.data);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen ocean-gradient flex items-center justify-center">
        <ParticleBackground />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading your roadmap...</p>
        </motion.div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen ocean-gradient flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 text-center">
          <p className="text-muted-foreground mb-4">No roadmap found. Take the quiz first!</p>
          <button onClick={() => navigate("/quiz")} className="glow-button">Take Quiz</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "tree", label: "Skill Tree", icon: Target },
    { id: "gap", label: "Gap Analysis", icon: TrendingUp },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <div className="min-h-screen ocean-gradient relative">
      <ParticleBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 md:px-8 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold gradient-text">CareerDNA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card px-3 py-1.5 text-sm flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-semibold">{roadmap.overallMatch}%</span>
            <span className="text-muted-foreground hidden sm:inline">Match</span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="relative z-10 px-4 md:px-8 pt-6">
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skill Tree */}
        {activeTab === "tree" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
            {roadmap.skillTree.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.1 }}
                className="glass-card p-5"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {cat.category}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.skills.map((skill, si) => {
                    const pct = Math.round((skill.level / skill.required) * 100);
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: ci * 0.1 + si * 0.05 }}
                        className="glass-card-hover p-3"
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-primary font-semibold">{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.3 + si * 0.1, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{
                              background: pct >= 80 ? "hsl(142, 71%, 45%)" : pct >= 50 ? "hsl(48, 96%, 53%)" : "hsl(0, 84%, 60%)",
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Gap Analysis */}
        {activeTab === "gap" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-12">
            <div className="glass-card p-6 text-center mb-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(210 20% 18%)" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="hsl(187 85% 43%)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={314}
                    initial={{ strokeDashoffset: 314 }}
                    animate={{ strokeDashoffset: 314 - (314 * roadmap.overallMatch) / 100 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className="absolute font-display text-3xl font-bold gradient-text">{roadmap.overallMatch}%</span>
              </div>
              <p className="text-muted-foreground mt-3">Overall Skill Match</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {roadmap.gapAnalysis.map((gap, i) => (
                <motion.div
                  key={gap.skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card-hover p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">{gap.skill}</span>
                    <span className={`text-sm font-bold ${gap.match >= 80 ? "text-green-400" : gap.match >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                      {gap.match}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${gap.match}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{
                        background: gap.match >= 80 ? "hsl(142, 71%, 45%)" : gap.match >= 50 ? "hsl(48, 96%, 53%)" : "hsl(0, 84%, 60%)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        {activeTab === "timeline" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
              <div className="space-y-6">
                {roadmap.timeline.map((month, i) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
                    <div className="glass-card-hover p-4">
                      <div className="text-xs text-primary font-semibold mb-1">Month {month.month}</div>
                      <h4 className="font-display font-semibold mb-2">{month.title}</h4>
                      <ul className="space-y-1">
                        {month.tasks.map((task, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12">
            {/* XP Bar */}
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Level 1 Explorer
                </span>
                <span className="text-xs text-muted-foreground">
                  {achievements.filter((a) => a.unlocked).length * 100} XP
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievements.filter((a) => a.unlocked).length / Math.max(achievements.length, 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-aqua-light"
                />
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className={`glass-card p-4 text-center ${!ach.unlocked ? "opacity-40" : ""}`}
                >
                  <div className="text-3xl mb-2">{ach.icon || "🏆"}</div>
                  <h4 className="text-sm font-semibold mb-1">{ach.achievement_name}</h4>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                  {ach.unlocked && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      <Star className="h-3 w-3" /> Unlocked
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
