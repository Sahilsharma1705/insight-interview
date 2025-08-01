import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: number;
  color: 'primary' | 'success' | 'warning' | 'accent';
  icon: LucideIcon;
  inverted?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  color, 
  icon: Icon, 
  inverted = false 
}) => {
  const displayScore = Math.round(score);
  const normalizedScore = inverted ? 100 - score : score;
  
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary border-primary/20';
      case 'success':
        return 'text-success border-success/20';
      case 'warning':
        return 'text-warning border-warning/20';
      case 'accent':
        return 'text-accent border-accent/20';
      default:
        return 'text-primary border-primary/20';
    }
  };

  const getScoreColor = () => {
    if (normalizedScore >= 70) return 'text-success';
    if (normalizedScore >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getBackgroundGlow = () => {
    switch (color) {
      case 'primary':
        return 'hover:shadow-primary';
      case 'success':
        return 'hover:shadow-success';
      case 'warning':
        return 'hover:shadow-[0_10px_30px_-10px_hsl(var(--warning)/0.3)]';
      case 'accent':
        return 'hover:shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.3)]';
      default:
        return 'hover:shadow-primary';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 transform hover:scale-105 border-2",
      getColorClasses(),
      getBackgroundGlow()
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("h-5 w-5", getColorClasses().split(' ')[0])} />
          <span className={cn("text-2xl font-bold", getScoreColor())}>
            {displayScore}
          </span>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              color === 'primary' && "bg-primary",
              color === 'success' && "bg-success",
              color === 'warning' && "bg-warning",
              color === 'accent' && "bg-accent"
            )}
            style={{ width: `${displayScore}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};