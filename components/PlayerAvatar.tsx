
import React from 'react';
import { AvatarOptions } from '../types';
import { cn } from '../lib/utils';

interface PlayerAvatarProps {
  options: AvatarOptions;
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ options, className }) => {
  const { skinColor, hairColor, outfitColor, accentColor, hairStyle, eyeStyle } = options;

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <svg viewBox="0 0 200 240" role="img" aria-label="Player Avatar" shapeRendering="crispEdges">
        <defs>
          <clipPath id="headClip">
            <ellipse cx="100" cy="80" rx="55" ry="60" />
          </clipPath>
        </defs>
        
        {/* Body */}
        <g transform="translate(0, 80)">
          <rect x="30" y="70" width="140" height="110" rx="20" fill={outfitColor} />
          <rect x="60" y="20" width="80" height="80" rx="40" fill={skinColor} />
          <rect x="0" y="120" width="200" height="20" fill={accentColor} opacity="0.4" />
        </g>

        {/* Head */}
        <g clipPath="url(#headClip)">
          <ellipse cx="100" cy="80" rx="55" ry="60" fill={skinColor} />

          {/* Hair */}
          {hairStyle === "spiky" && (
            <path d="M30 65 C60 25 140 25 170 65 L170 45 C140 10 60 10 30 45 Z" fill={hairColor} />
          )}
          {hairStyle === "short" && (
            <path d="M32 64 C62 40 138 40 168 64 L168 54 C138 28 62 28 32 54 Z" fill={hairColor} />
          )}
          {hairStyle === "long" && (
            <path d="M28 62 C48 110 152 110 172 62 L172 48 C152 110 48 110 28 48 Z" fill={hairColor} />
          )}
          {hairStyle === "bun" && (
            <g>
              <circle cx="100" cy="38" r="20" fill={hairColor} />
              <path d="M32 64 C62 46 138 46 168 64 L168 54 C138 34 62 34 32 54 Z" fill={hairColor} />
            </g>
          )}
          {hairStyle === "mohawk" && (
            <path d="M90 20 L110 20 L110 70 L90 70 Z" fill={hairColor} />
          )}

          {/* Eyes */}
          {eyeStyle === "normal" && (
            <>
              <circle cx="80" cy="82" r="6" fill="#000" />
              <circle cx="120" cy="82" r="6" fill="#000" />
            </>
          )}
          {eyeStyle === "happy" && (
            <>
              <path d="M74 82 q6 -6 12 0" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M114 82 q6 -6 12 0" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
          {eyeStyle === "sleepy" && (
            <>
              <path d="M72 84 q10 -2 18 0" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M112 84 q10 -2 18 0" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}
          {eyeStyle === "angry" && (
            <>
                <path d="M75 78 l10 5" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M125 78 l-10 5" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          <path d="M88 108 q12 8 24 0" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default PlayerAvatar;
