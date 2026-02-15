import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; pulse: number; pulseSpeed: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles with pulse
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        size: Math.random() * 3 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ambient glow orbs
      const time = Date.now() * 0.001;
      const orbs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 120, color: "187, 85%, 43%" },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 100, color: "185, 70%, 55%" },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 90, color: "175, 60%, 40%" },
      ];
      orbs.forEach((orb, i) => {
        const ox = orb.x + Math.sin(time * 0.3 + i) * 30;
        const oy = orb.y + Math.cos(time * 0.4 + i) * 20;
        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        gradient.addColorStop(0, `hsla(${orb.color}, 0.06)`);
        gradient.addColorStop(1, `hsla(${orb.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(ox - orb.r, oy - orb.r, orb.r * 2, orb.r * 2);
      });

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulsedOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        const pulsedSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse));

        // Glow effect
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedSize * 4);
        glow.addColorStop(0, `hsla(187, 85%, 43%, ${pulsedOpacity * 0.3})`);
        glow.addColorStop(1, `hsla(187, 85%, 43%, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - pulsedSize * 4, p.y - pulsedSize * 4, pulsedSize * 8, pulsedSize * 8);

        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 85%, 53%, ${pulsedOpacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (j <= i) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(187, 85%, 43%, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default ParticleBackground;
