import React, { useEffect, useRef } from 'react';

interface VibrantDoodle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'dna' | 'neuron' | 'cell' | 'heart' | 'gene_label' | 'star';
  label?: string;
  angle: number;
  vRot: number;
  color: string;
}

export const GeneticDoodles: React.FC<{ opacity?: number }> = ({ opacity = 0.95 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const mouse = { x: -1000, y: -1000 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Vibrant colors: yellow, cyan, rose, emerald, white
    const vibrantColors = [
      '#facc15', // Vibrant Yellow
      '#38bdf8', // Vibrant Sky Blue
      '#f43f5e', // Vibrant Rose Pink
      '#34d399', // Vibrant Emerald Green
      '#ffffff', // Pure White
      '#a855f7'  // Vibrant Purple
    ];

    const doodleTypes: VibrantDoodle['type'][] = ['dna', 'neuron', 'cell', 'heart', 'gene_label', 'star'];
    const geneLabels = ['APP', 'MAPT', 'PSEN1', 'TREM2', 'APOE', 'BIN1'];

    const doodles: VibrantDoodle[] = [];
    const count = 42;

    for (let i = 0; i < count; i++) {
      const type = doodleTypes[i % doodleTypes.length];
      doodles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 15 + 10,
        type,
        label: type === 'gene_label' ? geneLabels[i % geneLabels.length] : undefined,
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.007,
        color: vibrantColors[i % vibrantColors.length]
      });
    }

    const drawVibrantDoodle = (d: VibrantDoodle) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle);
      ctx.strokeStyle = d.color;
      ctx.fillStyle = d.color;
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (d.type === 'dna') {
        // Vibrant hand-drawn DNA double helix
        ctx.beginPath();
        for (let t = -12; t <= 12; t += 3) {
          const y1 = t;
          const x1 = Math.sin(t * 0.25) * 8;
          const x2 = -x1;
          if (t === -12) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          if (t % 6 === 0) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
          }
        }
        ctx.stroke();
      } else if (d.type === 'neuron') {
        // Friendly neuron with cute smile
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.stroke();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6);
          ctx.lineTo(Math.cos(a) * 15, Math.sin(a) * 15);
          ctx.stroke();
        }
        // Face
        ctx.beginPath();
        ctx.arc(-2, -1, 1, 0, Math.PI * 2);
        ctx.arc(2, -1, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 1, 2.5, 0, Math.PI);
        ctx.stroke();
      } else if (d.type === 'cell') {
        // Cute cell membrane with heart nucleus
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1.5, -1.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (d.type === 'heart') {
        // Vibrant heart doodle
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(-6, -4, -10, 2, 0, 9);
        ctx.bezierCurveTo(10, 2, 6, -4, 0, 4);
        ctx.fill();
      } else if (d.type === 'gene_label' && d.label) {
        // Vibrant gene pill
        ctx.beginPath();
        ctx.roundRect(-18, -10, 36, 20, 10);
        ctx.stroke();
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText(d.label, -13, 3.5);
      } else {
        // Vibrant sparkle
        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(2, -2);
        ctx.lineTo(7, 0);
        ctx.lineTo(2, 2);
        ctx.lineTo(0, 7);
        ctx.lineTo(-2, 2);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-2, -2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < doodles.length; i++) {
        const d = doodles[i];

        d.x += d.vx;
        d.y += d.vy;
        d.angle += d.vRot;

        if (d.x < 15 || d.x > width - 15) d.vx *= -1;
        if (d.y < 15 || d.y > height - 15) d.vy *= -1;

        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110;
          d.vx += (dx / dist) * force * 0.22;
          d.vy += (dy / dist) * force * 0.22;
        }

        d.vx *= 0.99;
        d.vy *= 0.99;

        drawVibrantDoodle(d);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
    />
  );
};
