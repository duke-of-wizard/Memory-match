import { motion } from 'framer-motion';
import type { GameCard as GameCardType } from '../../types/game';

interface GameCardProps {
  card: GameCardType;
  onClick: () => void;
  disabled: boolean;
  isAirline: boolean;
}

const cardBackStyle: React.CSSProperties = {
  background: `
    repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.08) 5px, rgba(255,255,255,0.08) 10px),
    linear-gradient(150deg, #20DDB2 0%, #17C89E 40%, #12AB85 100%)
  `,
};

export function GameCard({ card, onClick, disabled, isAirline }: GameCardProps) {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <motion.button
      whileHover={!disabled && !isRevealed ? { scale: 1.05, y: -1 } : {}}
      whileTap={!disabled && !isRevealed ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || isRevealed}
      className="perspective w-full aspect-square cursor-pointer"
    >
      <motion.div
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="preserve-3d relative w-full h-full"
      >
        {/* Back (face down) */}
        <div
          className={`backface-hidden absolute inset-0 rounded-xl flex items-center justify-center transition-all duration-150 ${card.isMatched ? 'opacity-30' : 'shadow-sm hover:shadow-md'}`}
          style={cardBackStyle}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white text-xs font-black">M</span>
          </div>
        </div>

        {/* Front (face up) */}
        <div className={`backface-hidden rotate-y-180 absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-white border transition-all duration-300 ${card.isMatched ? 'border-primary/30 matched-glow' : 'border-border shadow-sm'}`}
        >
          {isAirline ? (
            <>
              <span className="text-lg md:text-xl">{card.content.display}</span>
              <span className="text-[8px] md:text-[9px] font-bold text-text-primary mt-0.5 text-center px-1 uppercase tracking-wide line-clamp-1">
                {card.content.label}
              </span>
            </>
          ) : (
            <span className="text-2xl sm:text-3xl md:text-4xl">{card.content.display}</span>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}
