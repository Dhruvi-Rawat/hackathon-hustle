import { motion } from "framer-motion";

const DNAHelix = () => {
  const points = 12;

  return (
    <div className="relative h-[400px] w-[120px] mx-auto">
      {Array.from({ length: points }).map((_, i) => {
        const delay = i * 0.15;
        const yPos = (i / points) * 100;
        return (
          <div key={i} className="absolute w-full" style={{ top: `${yPos}%` }}>
            {/* Left strand */}
            <motion.div
              animate={{
                x: [0, 40, 0, -40, 0],
                scale: [1, 1.2, 1, 0.8, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
              className="absolute left-0 h-3 w-3 rounded-full bg-primary shadow-lg"
              style={{ boxShadow: "0 0 12px hsl(187 85% 43% / 0.6)" }}
            />
            {/* Right strand */}
            <motion.div
              animate={{
                x: [0, -40, 0, 40, 0],
                scale: [1, 0.8, 1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
              className="absolute right-0 h-3 w-3 rounded-full"
              style={{
                background: "hsl(185 70% 55%)",
                boxShadow: "0 0 12px hsl(185 70% 55% / 0.6)",
              }}
            />
            {/* Connector */}
            <motion.div
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay }}
              className="absolute top-1 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-aqua-light"
            />
          </div>
        );
      })}
    </div>
  );
};

export default DNAHelix;
