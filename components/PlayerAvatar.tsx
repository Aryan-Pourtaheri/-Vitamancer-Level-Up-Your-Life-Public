

import React, { useRef, useEffect } from 'react';
import { AvatarOptions } from '../types';
import { cn } from '../lib/utils';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

interface PlayerAvatarProps {
  options: AvatarOptions;
  characterClass: string;
  className?: string;
  playing?: boolean;
}

const GRID = 48; // Increased grid size for more detail
const SCALE = 5; // Adjusted scale for a larger canvas but sharp pixels
const CANVAS_SIZE = GRID * SCALE;
const FRAMES = 8;
const ANIMATION_SPEED_MS = 160; // Slightly adjusted timing for a natural feel

interface Palette { base: string; s1: string; s2: string; h1: string; }

// --- ADVANCED PALETTE CREATION ---
// Using hue-shifting for more vibrant and professional pixel art shading.
// Shadows shift towards cooler tones (blue/purple), highlights towards warmer tones (yellow).
const createPalette = (hex: string): Palette => {
    const base = colord(hex);
    return {
        base: base.toHex(),
        s1: base.darken(0.12).saturate(0.05).rotate(-5).mix('#424f6b', 0.08).toHex(),
        s2: base.darken(0.25).saturate(0.1).rotate(-10).mix('#424f6b', 0.16).toHex(),
        h1: base.lighten(0.1).desaturate(0.05).rotate(5).mix('#fffde4', 0.05).toHex(),
    };
};

// --- RENDER CONTEXT AND UTILITIES ---
interface RenderContext {
    ctx: CanvasRenderingContext2D;
    grid: (string | null)[][];
    options: AvatarOptions;
    p: Record<string, Palette | any>;
    anim: Record<string, number>;
}
// Set a single pixel on the grid. Grid is rendered at the end.
const setPixel = (ctx: RenderContext, y: number, x: number, color: string) => {
    if (y < 0 || y >= GRID || x < 0 || x >= GRID) return;
    ctx.grid[y][x] = color;
};
// Fill a rectangle on the grid.
const fillRect = (ctx: RenderContext, y: number, x: number, h: number, w: number, color: string) => {
    for (let i = y; i < y + h; i++) for (let j = x; j < x + w; j++) setPixel(ctx, i, j, color);
};
// Draw a horizontal line on the grid.
const hLine = (ctx: RenderContext, y: number, x: number, w: number, color: string) => {
    for (let i = x; i < x + w; i++) setPixel(ctx, y, i, color);
}


// --- MODULAR DRAWING FUNCTIONS: UNIVERSAL PARTS ---

const drawHead = (ctx: RenderContext, headY: number, cx: number) => {
    const { options, p } = ctx;
    // Outline and base shape
    fillRect(ctx, headY, cx - 5, 9, 11, p.outline);
    fillRect(ctx, headY + 1, cx - 4, 7, 9, p.skin.base);
    // Shading
    hLine(ctx, headY + 7, cx - 4, 9, p.skin.s1);
    hLine(ctx, headY + 8, cx - 3, 7, p.skin.s2);
    setPixel(ctx, headY + 2, cx - 3, p.skin.h1); setPixel(ctx, headY + 2, cx, p.skin.h1); setPixel(ctx, headY + 2, cx + 3, p.skin.h1);

    // Eyes
    const eyeY = headY + 4;
    switch(options.eyeStyle) {
        case 'happy': { hLine(ctx, eyeY, cx-3, 3, p.outline); hLine(ctx, eyeY, cx+1, 3, p.outline); setPixel(ctx, eyeY+1, cx-4, p.outline); setPixel(ctx, eyeY+1, cx+4, p.outline); break; }
        // FIX: Replaced `vLine` calls with `fillRect` and a width of 1 to resolve argument mismatch issues.
        case 'angry': { hLine(ctx, eyeY, cx-4, 4, p.outline); hLine(ctx, eyeY, cx+1, 4, p.outline); fillRect(ctx, eyeY+1, cx-2, 2, 1, p.outline); fillRect(ctx, eyeY+1, cx+3, 2, 1, p.outline); break; }
        case 'sleepy': { hLine(ctx, eyeY + 1, cx - 3, 3, p.outline); hLine(ctx, eyeY + 1, cx + 1, 3, p.outline); break; }
        default: { fillRect(ctx, eyeY, cx - 3, 2, 2, p.outline); 
// FIX: Added the missing width argument (2) to the fillRect call to match its signature (6 arguments).
fillRect(ctx, eyeY, cx + 2, 2, 2, p.outline); break; }
    }
};

const drawHair = (ctx: RenderContext, headY: number, cx: number) => {
    const { options, p, anim } = ctx;
    const hairY = headY - 4;
    const hairSway = anim.sway;
    switch(options.hairStyle) {
        case 'spiky':
            fillRect(ctx, hairY, cx - 7, 8, 15, p.hair.s2); fillRect(ctx, hairY, cx - 6, 7, 13, p.hair.s1);
            fillRect(ctx, hairY + 1, cx - 5, 5, 11, p.hair.base);
            setPixel(ctx, hairY - 1, cx - 5, p.hair.base); setPixel(ctx, hairY - 2, cx - 3, p.hair.base); setPixel(ctx, hairY - 2, cx - 2, p.hair.h1);
            setPixel(ctx, hairY - 1, cx, p.hair.base); setPixel(ctx, hairY - 2, cx + 1, p.hair.base); setPixel(ctx, hairY - 2, cx + 2, p.hair.h1);
            setPixel(ctx, hairY - 1, cx + 4, p.hair.base); setPixel(ctx, hairY - 2, cx + 6, p.hair.base);
            hLine(ctx, headY + 5, cx - 6, 2, p.hair.base); hLine(ctx, headY + 5, cx + 5, 2, p.hair.base); // Sideburns
            break;
        case 'short':
            fillRect(ctx, hairY + 3, cx - 6, 6, 13, p.hair.s2); fillRect(ctx, hairY + 3, cx - 5, 5, 11, p.hair.base);
            fillRect(ctx, hairY + 4, cx - 3, 2, 7, p.hair.h1);
            setPixel(ctx, hairY + 8, cx - 5, p.hair.base); setPixel(ctx, hairY + 8, cx - 3, p.hair.base);
            setPixel(ctx, hairY + 8, cx + 5, p.hair.base); setPixel(ctx, hairY + 8, cx + 3, p.hair.base);
            break;
        case 'long':
            fillRect(ctx, hairY + 3, cx - 6, 6, 13, p.hair.s2); fillRect(ctx, hairY + 3, cx - 5, 5, 11, p.hair.base);
            fillRect(ctx, hairY + 4, cx - 3, 1, 7, p.hair.h1);
            // Flowing side locks with independent sway
            fillRect(ctx, hairY + 9, cx - 8 + hairSway, 12, 4, p.hair.s2); fillRect(ctx, hairY + 9, cx - 7 + hairSway, 11, 3, p.hair.base);
            fillRect(ctx, hairY + 9, cx + 5 - hairSway, 12, 4, p.hair.s2); fillRect(ctx, hairY + 9, cx + 5 - hairSway, 11, 3, p.hair.base);
            break;
        case 'bun':
            fillRect(ctx, hairY + 4, cx - 5, 5, 11, p.hair.s2); fillRect(ctx, hairY + 4, cx - 4, 4, 9, p.hair.base);
            fillRect(ctx, hairY - 2, cx - 1, 7, 7, p.hair.s2); fillRect(ctx, hairY - 1, cx, 5, 5, p.hair.base);
            setPixel(ctx, hairY, cx + 1, p.hair.h1);
            break;
        case 'mohawk':
            fillRect(ctx, hairY + 5, cx - 5, 4, 3, p.hair.s2); fillRect(ctx, hairY + 5, cx + 3, 4, 3, p.hair.s2); // Shaved sides
            const mohawkSway = Math.abs(Math.round(anim.sway / 2));
            fillRect(ctx, hairY - 2 + mohawkSway, cx - 2, 13, 5, p.hair.s2);
            fillRect(ctx, hairY - 1 + mohawkSway, cx - 2, 12, 5, p.hair.base);
            fillRect(ctx, hairY - 1 + mohawkSway, cx - 1, 10, 3, p.hair.h1);
            break;
    }
};

const drawCloak = (ctx: RenderContext, bodyY: number, cx: number) => {
    const { p, anim } = ctx;
    const cloakPalette = createPalette(colord(ctx.options.accentColor).darken(0.1).toHex());
    const cloakSway = Math.floor(anim.sway * 1.5);
    fillRect(ctx, bodyY, cx - 10, 24, 21, p.outline); 
    fillRect(ctx, bodyY + 1, cx - 9, 23, 19, cloakPalette.s2);
    fillRect(ctx, bodyY + 1, cx - 8, 22, 17, cloakPalette.s1); 
    fillRect(ctx, bodyY + 2, cx - 7, 20, 15, cloakPalette.base);
    // Animated bottom edge of the cloak
    for(let i=0; i < 17; i++) {
        setPixel(ctx, bodyY + 23, cx - 9 + i, cloakPalette.s2);
        if (i > 2 && i < 14) { setPixel(ctx, bodyY + 22, cx - 9 + i + cloakSway, cloakPalette.s1); }
    }
};

// --- MODULAR DRAWING FUNCTIONS: CLASS-SPECIFIC ---

const drawWarrior = (ctx: RenderContext) => {
    const { options, p, anim } = ctx;
    const cx = 24;
    const bodyY = 17 + anim.yBob;
    const headY = 9 + anim.yBob;

    // --- BACK LAYER ---
    if (options.cloak) { drawCloak(ctx, bodyY-2, cx); }

    if (options.weapon === 'sword') {
        const swordPalette = createPalette('#D8D8E0');
        const swordY = bodyY - 15, swordX = cx - 18 + anim.sway;
        fillRect(ctx, swordY + 20, swordX + 13, 3, 5, p.wood.base); // Hilt
        fillRect(ctx, swordY + 18, swordX + 8, 2, 14, p.accent.base); // Guard
        fillRect(ctx, swordY, swordX + 15, 20, 2, swordPalette.s2); // Blade Shadow
        fillRect(ctx, swordY, swordX + 14, 20, 2, swordPalette.base); // Blade
        fillRect(ctx, swordY + 2, swordX + 14, 16, 1, swordPalette.h1); // Blade Edge Highlight
        if (anim.glint > 0) fillRect(ctx, swordY + 4, swordX + 14, anim.glint, 2, '#FFFFFF'); // Animated Glint
    }

    // --- CHARACTER LAYER ---
    // Legs & Boots
    fillRect(ctx, 33, cx - 9, 8, 7, p.metal.s2); // Left boot
    fillRect(ctx, 33, cx - 8, 7, 5, p.metal.base);
    fillRect(ctx, 33, cx + 3, 8, 7, p.metal.s2); // Right boot
    fillRect(ctx, 33, cx + 4, 7, 5, p.metal.base);
    fillRect(ctx, 27, cx - 7, 7, 6, p.outfit.s1); // Left leg
    fillRect(ctx, 27, cx + 2, 7, 6, p.outfit.s1); // Right leg

    // Torso & Arms (Plate Armor)
    const armorPalette = createPalette(options.outfitColor);
    fillRect(ctx, bodyY, cx - 8, 12, 17, p.outline); // Body outline
    fillRect(ctx, bodyY + 1, cx - 7, 11, 15, armorPalette.s2); // Armor base
    fillRect(ctx, bodyY + 1, cx - 6, 10, 13, armorPalette.s1);
    fillRect(ctx, bodyY + 2, cx - 5, 8, 11, armorPalette.base);
    fillRect(ctx, bodyY + 3, cx - 4, 6, 9, armorPalette.h1); // Chest highlight
    // Pauldrons
    fillRect(ctx, bodyY, cx - 11, 5, 5, armorPalette.base);
    fillRect(ctx, bodyY, cx + 7, 5, 5, armorPalette.base);
    // Gauntlets
    fillRect(ctx, bodyY + 7, cx - 13, 5, 4, p.metal.base);
    fillRect(ctx, bodyY + 7, cx + 10, 5, 4, p.metal.base);

    // --- HEAD LAYER ---
    drawHead(ctx, headY, cx);
    if(options.hat) {
        fillRect(ctx, headY - 4, cx - 8, 8, 17, p.metal.s2);
        fillRect(ctx, headY - 3, cx - 7, 6, 15, p.metal.base);
        fillRect(ctx, headY - 2, cx - 6, 4, 13, p.metal.h1);
    } else {
        drawHair(ctx, headY, cx);
    }
};

const drawMage = (ctx: RenderContext) => {
    const { options, p, anim } = ctx;
    const cx = 24;
    const bodyY = 18 + anim.yBob;
    const headY = 10 + anim.yBob;

    // --- BACK LAYER ---
    if (options.weapon === 'staff') {
        const staffX = cx + 9 + anim.sway;
        fillRect(ctx, 6, staffX, 36, 3, p.wood.s2); 
        fillRect(ctx, 6, staffX + 1, 35, 2, p.wood.base);
        const gemY = 4, gemX = staffX - 1;
        fillRect(ctx, gemY, gemX, 7, 7, p.accent.s2); 
        fillRect(ctx, gemY + 1, gemX + 1, 5, 5, p.gem);
        if(anim.gemPulse > 0) fillRect(ctx, gemY + 2, gemX + 2, 3, 3, p.gemH);
    }
    
    // --- CHARACTER LAYER ---
    const robeSway = Math.floor(anim.sway * 1.5);
    fillRect(ctx, bodyY - 1, cx - 9, 24, 19, p.outline); // Outline
    fillRect(ctx, bodyY, cx - 8, 23, 17, p.outfit.s2); // Base Robe
    fillRect(ctx, bodyY, cx - 7, 22, 15, p.outfit.s1);
    fillRect(ctx, bodyY + 1, cx - 6, 20, 13, p.outfit.base);
    // Animated robe bottom
    for(let i=0; i < 15; i++) {
        setPixel(ctx, bodyY + 22, cx - 7 + i, p.outfit.s2);
        if (i > 1 && i < 13) { setPixel(ctx, bodyY + 21, cx - 7 + i + robeSway, p.outfit.s1); }
    }
    fillRect(ctx, bodyY + 2, cx - 4, 6, 9, p.outfit.h1); // Chest highlight

    // Arms
    fillRect(ctx, bodyY + 2, cx + 7, 10, 4, p.outfit.s1); // Right arm (on staff)
    fillRect(ctx, bodyY + 6, cx + 11, 4, 3, p.skin.base);
    fillRect(ctx, bodyY + 2, cx - 11, 10, 4, p.outfit.s1); // Left arm (casting)
    fillRect(ctx, bodyY + 6, cx - 13, 4, 3, p.skin.base);

    if (options.cloak) { // Sash
        const sashPalette = createPalette(options.accentColor);
        fillRect(ctx, bodyY - 2, cx - 7, 18, 4, sashPalette.s1);
        fillRect(ctx, bodyY - 2, cx - 6, 17, 3, sashPalette.base);
    }

    // --- HEAD LAYER ---
    drawHead(ctx, headY, cx);
    if(options.hat) {
        const hatY = headY - 6;
        fillRect(ctx, hatY, cx - 10, 8, 21, p.accent.s2);
        fillRect(ctx, hatY + 1, cx - 9, 7, 19, p.accent.base);
        fillRect(ctx, hatY - 3, cx - 3, 7, 7, p.accent.base);
        setPixel(ctx, hatY - 4, cx - 2, p.accent.base); setPixel(ctx, hatY - 4, cx, p.accent.base); setPixel(ctx, hatY - 4, cx + 2, p.accent.base);
    } else {
        drawHair(ctx, headY, cx);
    }
};

const drawRogue = (ctx: RenderContext) => {
    const { options, p, anim } = ctx;
    const cx = 24;
    const bodyY = 18 + anim.yBob;
    const headY = 10 + anim.yBob;
    
    // --- BACK LAYER ---
    if (options.cloak) {
        const cloakPalette = createPalette(options.accentColor);
        fillRect(ctx, headY-1, cx - 6, 14, 13, p.outline); // Hood outline
        fillRect(ctx, headY, cx-5, 13, 11, cloakPalette.s2);
        fillRect(ctx, headY, cx-4, 12, 9, cloakPalette.base);
    }
    if (options.weapon === 'bow') {
        const bowSway = Math.round(anim.sway / 2);
        const bowX = cx - 16 + bowSway;
        fillRect(ctx, 8, bowX, 32, 4, p.wood.s2);
        fillRect(ctx, 9, bowX+1, 30, 2, p.wood.base);
    }

    // --- CHARACTER LAYER ---
    // Legs
    fillRect(ctx, 31, cx - 6, 8, 6, p.outfit.s2); // Left leg
    fillRect(ctx, 31, cx + 1, 8, 6, p.outfit.s2); // Right leg
    // Torso
    fillRect(ctx, bodyY, cx - 7, 13, 15, p.outline);
    fillRect(ctx, bodyY + 1, cx - 6, 12, 13, p.outfit.s2);
    fillRect(ctx, bodyY + 1, cx - 5, 11, 11, p.outfit.base);
    // Arms
    fillRect(ctx, bodyY + 3, cx - 11, 7, 4, p.outfit.s1); // Left arm
    fillRect(ctx, bodyY + 5, cx - 13, 4, 3, p.skin.base);
    fillRect(ctx, bodyY + 3, cx + 8, 7, 4, p.outfit.s1); // Right arm
    fillRect(ctx, bodyY + 5, cx + 11, 4, 3, p.skin.base);

    // --- HEAD LAYER ---
    drawHead(ctx, headY, cx);
    // The cloak includes a hood, so we don't draw hair or hat if cloak is on.
    if (!options.cloak) {
      if(options.hat) {
          fillRect(ctx, headY, cx-5, 4, 11, p.accent.s2);
          fillRect(ctx, headY+1, cx-4, 3, 9, p.accent.base);
      } else {
          drawHair(ctx, headY, cx);
      }
    }
}


// --- MAIN PAINT FUNCTION ---
const paintFrameToCtx = (ctx: CanvasRenderingContext2D, frame: number, options: AvatarOptions, characterClass: string) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // More nuanced animation curves for a less robotic feel
    const anim = {
        yBob:      [0, 1, 2, 1, 0, -1, -1, 0][frame],
        sway:      [-2, -1, 0, 1, 2, 1, 0, -1][frame],
        gemPulse:  [0, 0, 1, 1, 1, 0, 0, 0][frame],
        glint:     [0, 0, 0, 0, 4, 8, 4, 0][frame], // Glint is now a size
    };

    const p = {
        skin: createPalette(options.skinColor),
        hair: createPalette(options.hairColor),
        outfit: createPalette(options.outfitColor),
        accent: createPalette(options.accentColor),
        outline: '#222034',
        metal: createPalette('#B0C4DE'),
        wood: createPalette('#8B4513'),
        gem: anim.gemPulse ? '#FF77FF' : '#E54EE5',
        gemH: anim.gemPulse ? '#FFDDFF' : '#FFBBFF'
    };
    
    const grid: (string | null)[][] = Array(GRID).fill(null).map(() => Array(GRID).fill(null));
    const renderCtx: RenderContext = { ctx, grid, options, p, anim };

    // --- Select correct drawing function based on class ---
    switch(characterClass) {
        case 'Warrior':
        case 'Paladin':
             drawWarrior(renderCtx);
             break;
        case 'Mage':
        case 'Cleric':
            drawMage(renderCtx);
            break;
        case 'Rogue':
        case 'Archer':
            drawRogue(renderCtx);
            break;
        default:
            drawWarrior(renderCtx); // Fallback to Warrior
            break;
    }
    
    // Final Render from grid to canvas: This is the only place we draw to the actual context.
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

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ options, characterClass, className, playing = true }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const frame = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        
        // Ensure crisp pixels
        ctx.imageSmoothingEnabled = false;

        const animate = (timestamp: number) => {
            if (playing) {
                const deltaTime = timestamp - lastTime.current;
                if (deltaTime > ANIMATION_SPEED_MS) {
                    lastTime.current = timestamp;
                    frame.current = (frame.current + 1) % FRAMES;
                }
            } else {
                 frame.current = 0;
            }
            paintFrameToCtx(ctx, frame.current, options, characterClass);
            animationFrameId.current = requestAnimationFrame(animate);
        };

        // Start animation
        animationFrameId.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [options, characterClass, playing]);

    return (
        <div className={cn("flex justify-center items-center w-full h-full", className)}>
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
                role="img"
                aria-label={`Player Avatar for ${characterClass}`}
            />
        </div>
    );
};

export default PlayerAvatar;
