import { useEffect, useState } from 'react';

interface LevelBadgeProps {
  level: number;
}

export default function LevelBadge({ level }: LevelBadgeProps) {
  const [visible, setVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);

  useEffect(() => {
    // Check if level is a milestone
    if (level === 1 || level === 5 || level === 10) {
      if (currentMilestone !== level) {
        setCurrentMilestone(level);
        setVisible(true);

        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [level, currentMilestone]);

  if (!visible || !currentMilestone) return null;

  const badgeImages: Record<number, string> = {
    1: '/assets/generated/level-badge-1.dim_128x128.png',
    5: '/assets/generated/level-badge-5.dim_128x128.png',
    10: '/assets/generated/level-badge-10.dim_128x128.png',
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="animate-in zoom-in-50 fade-in duration-500 animate-out zoom-out-50 fade-out">
        <div className="rounded-2xl bg-background/95 p-8 shadow-2xl backdrop-blur-sm">
          <img
            src={badgeImages[currentMilestone]}
            alt={`Level ${currentMilestone} Badge`}
            className="h-32 w-32 animate-pulse"
          />
          <p className="mt-4 text-center text-2xl font-bold text-amber">Level {currentMilestone}!</p>
        </div>
      </div>
    </div>
  );
}
