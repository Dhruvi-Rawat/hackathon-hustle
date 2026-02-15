const WaveDivider = ({ flip = false }: { flip?: boolean }) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60L48 52C96 44 192 28 288 28C384 28 480 44 576 52C672 60 768 60 864 52C960 44 1056 28 1152 24C1248 20 1344 28 1392 32L1440 36V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
          fill="hsl(210 35% 10%)"
          fillOpacity="0.5"
        />
        <path
          d="M0 80L48 76C96 72 192 64 288 60C384 56 480 56 576 60C672 64 768 72 864 76C960 80 1056 80 1152 76C1248 72 1344 64 1392 60L1440 56V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V80Z"
          fill="hsl(187 85% 43%)"
          fillOpacity="0.05"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
