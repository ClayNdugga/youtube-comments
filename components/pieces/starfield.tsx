import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Constants
    const d = 150; // Projection plane distance
    const minDist = 0;
    const maxDist = 32;
    const numStars = 250;
    const frameRate = 30; // ms per frame

    let stars: StarElement[] = [];
    let animationId: NodeJS.Timeout;
    let xOffset: number;
    let yOffset: number;

    // Define the StarElement interface
    interface StarElement {
      x: number;
      y: number;
      dist: number;
      width: number;
    }

    // Function to project 3D points to 2D space
    const project2D = (x: number, y: number, dist: number) => {
      const projectedX = Math.round((d * x) / dist);
      const projectedY = Math.round((d * y) / dist);
      return { x: projectedX, y: projectedY };
    };

    // Function to create random stars
    const createStars = () => {
      stars = Array.from({ length: numStars }, () => ({
        x: randomRange(-50, 50),
        y: randomRange(-50, 50),
        dist: randomRange(minDist, maxDist),
        width: 3,
      }));
    };

    // Random range utility function
    const randomRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    // Draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Decrease the distance to create movement effect
        star.dist -= 0.2;

        // Reset stars that go out of range
        if (star.dist < minDist) {
          star.dist = maxDist;
        }

        const { x: projectedX, y: projectedY } = project2D(
          star.x,
          star.y,
          star.dist
        );

        // Skip drawing if out of bounds
        if (
          projectedX + xOffset <= 0 ||
          projectedX + xOffset >= canvas.width ||
          projectedY + yOffset <= 0 ||
          projectedY + yOffset >= canvas.height
        ) {
          star.dist = maxDist; // Reset distance
          return;
        }

        // Calculate brightness and size based on distance
        const brightness = 1 - star.dist / maxDist;
        const starColor = theme === 'dark' ? 'white' : 'black'
        star.width = brightness * 3;

        ctx.beginPath();
        ctx.strokeStyle = starColor;
        ctx.rect(
          projectedX + xOffset,
          projectedY + yOffset,
          star.width,
          star.width
        );
        ctx.stroke();
        ctx.closePath();
      });
    };

    // Update canvas size and restart animation on resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      xOffset = canvas.width / 2;
      yOffset = canvas.height / 2;

      createStars(); // Reinitialize stars
    };

    // Animation loop
    const animate = () => {
      drawStars();
      animationId = setTimeout(() => requestAnimationFrame(animate), frameRate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    // Cleanup
    return () => {
      clearTimeout(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return <canvas className="absolute inset-0 -z-10" ref={canvasRef}></canvas>;
};

export default Starfield;
