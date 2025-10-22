
import React, { useRef, useEffect } from 'react';
import { AvatarOptions } from '../types';
import { cn } from '../lib/utils';

interface PlayerAvatarProps {
  options: AvatarOptions;
  className?: string;
  playing?: boolean;
}

const GRID = 32;
const SCALE = 8;
const CANVAS_SIZE = GRID * SCALE;
const FRAMES = 3;

const paintFrameToCtx = (ctx: CanvasRenderingContext2D, frameIndex: number, options: AvatarOptions) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const grid: (string | null)[][] = Array(GRID).fill(null).map(() => Array(GRID).fill(null));

    const { skinColor, hairColor, outfitColor, accentColor, hairStyle, eyeStyle, hat, weapon, cloak } = options;
    const eyeColor = "#000000";

    // Body
    for (let y = 18; y <= 26; y++) for (let x = 12; x <= 19; x++) grid[y][x] = outfitColor;
    grid[17][11] = outfitColor; grid[17][20] = outfitColor;
    grid[16][14] = skinColor; grid[16][15] = skinColor; grid[16][16] = skinColor;

    // Head
    for (let y = 9; y <= 15; y++) for (let x = 12; x <= 19; x++) grid[y][x] = skinColor;
    grid[15][11] = skinColor; grid[15][20] = skinColor;

    // Eyes
    if (eyeStyle === 'normal') {
        grid[12][14] = eyeColor; grid[12][17] = eyeColor;
    } else if (eyeStyle === 'happy') {
        grid[11][13] = eyeColor; grid[12][14] = eyeColor; grid[11][15] = eyeColor;
        grid[11][16] = eyeColor; grid[12][17] = eyeColor; grid[11][18] = eyeColor;
    } else if (eyeStyle === 'sleepy') {
        grid[12][13] = eyeColor; grid[12][14] = eyeColor; grid[12][15] = eyeColor;
        grid[12][16] = eyeColor; grid[12][17] = eyeColor; grid[12][18] = eyeColor;
    } else if (eyeStyle === 'angry') {
        grid[11][13] = eyeColor; grid[12][14] = eyeColor; grid[11][15] = eyeColor;
        grid[12][16] = eyeColor; grid[11][17] = eyeColor; grid[11][18] = eyeColor;
    }
    
    // Mouth
    grid[14][15] = "#6B4226"; grid[14][16] = "#6B4226";

    // Hair
    if (hairStyle === "spiky") {
      grid[8][13] = hairColor; grid[7][15] = hairColor; grid[8][17] = hairColor; grid[8][16] = hairColor;
      grid[9][12] = hairColor; grid[9][19] = hairColor;
    } else if (hairStyle === "short") {
      for (let x = 12; x <= 19; x++) grid[9][x] = hairColor;
    } else if (hairStyle === "long") {
      for (let y = 9; y <= 12; y++) { grid[y][11] = hairColor; grid[y][20] = hairColor; }
      for (let x = 12; x <= 19; x++) grid[9][x] = hairColor;
    } else if (hairStyle === "bun") {
      grid[7][16] = hairColor; grid[7][15] = hairColor; grid[8][16] = hairColor; for (let x = 13; x <= 18; x++) grid[9][x] = hairColor;
    } else if (hairStyle === "mohawk") {
      for (let y = 7; y <= 12; y++) grid[y][16] = hairColor; for (let x = 14; x <= 18; x++) grid[9][x] = hairColor;
    }

    // Hat
    if (hat) {
      for (let x = 11; x <= 20; x++) grid[7][x] = accentColor;
      for (let x = 12; x <= 19; x++) grid[8][x] = accentColor;
    }

    // Cloak
    if (cloak) {
      for (let y = 17; y <= 27; y++) {
        grid[y][10] = accentColor; grid[y][21] = accentColor;
      }
      for (let x = 10; x <= 21; x++) grid[27][x] = accentColor;
    }

    // Arms (animated)
    const armOffset = frameIndex === 1 ? -1 : frameIndex === 2 ? 1 : 0;
    grid[18 + armOffset][11] = outfitColor; grid[19 + armOffset][11] = outfitColor; grid[20 + armOffset][10] = outfitColor;
    grid[18 - armOffset][20] = outfitColor; grid[19 - armOffset][20] = outfitColor; grid[20 - armOffset][21] = outfitColor;
    
    // Legs
    grid[28][14] = "#111"; grid[29][14] = "#111"; grid[28][17] = "#111"; grid[29][17] = "#111";

    // Weapon
    if (weapon === "sword") {
      const sx = 22;
      grid[16][sx] = "#AAA"; grid[15][sx] = "#AAA"; grid[14][sx] = "#AAA"; grid[13][sx] = "#666";
      grid[17][sx -1] = accentColor; grid[17][sx] = accentColor;
    } else if (weapon === "staff") {
      const sx = 22; for (let y = 12; y <= 24; y++) grid[y][sx] = "#8B4513"; grid[11][sx] = accentColor;
    } else if (weapon === "bow") {
      const bx = 22; grid[16][bx] = "#8B4513"; grid[15][bx+1] = "#8B4513"; grid[17][bx-1] = "#8B4513";
    }

    // Render grid
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const col = grid[y][x];
        if (col) {
          ctx.fillStyle = col;
          ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
      }
    }
};


const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ options, className, playing = true }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId: number;

        const loop = (timestamp: number) => {
            if (playing) {
                const frameIndex = Math.floor(timestamp / 200) % FRAMES;
                paintFrameToCtx(ctx, frameIndex, options);
            }
            rafId = requestAnimationFrame(loop);
        };
        
        paintFrameToCtx(ctx, 0, options);
        
        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [options, playing]);

    return (
        <div className={cn("flex justify-center items-center w-full h-full", className)}>
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
                role="img"
                aria-label="Player Avatar"
            />
        </div>
    );
};

export default PlayerAvatar;
