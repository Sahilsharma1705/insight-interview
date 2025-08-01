import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EmotionData {
  timestamp: number;
  scores: {
    confidence: number;
    enthusiasm: number;
    stress: number;
    positivity: number;
  };
}

interface EmotionChartProps {
  data: EmotionData[];
}

export const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  const chartData = data.map(point => ({
    time: point.timestamp,
    confidence: Math.round(point.scores.confidence),
    enthusiasm: Math.round(point.scores.enthusiasm),
    stress: Math.round(point.scores.stress),
    positivity: Math.round(point.scores.positivity)
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            tickFormatter={formatTime}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            labelFormatter={(value) => `Time: ${formatTime(value as number)}`}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            name="Confidence"
          />
          <Line 
            type="monotone" 
            dataKey="enthusiasm" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            dot={false}
            name="Enthusiasm"
          />
          <Line 
            type="monotone" 
            dataKey="stress" 
            stroke="hsl(var(--warning))" 
            strokeWidth={2}
            dot={false}
            name="Stress"
          />
          <Line 
            type="monotone" 
            dataKey="positivity" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            dot={false}
            name="Positivity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};