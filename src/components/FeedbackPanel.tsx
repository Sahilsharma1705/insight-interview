import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, TrendingUp, Download, Lightbulb } from 'lucide-react';

interface EmotionScores {
  confidence: number;
  enthusiasm: number;
  stress: number;
  positivity: number;
}

interface FeedbackPanelProps {
  scores: EmotionScores;
  isRecording: boolean;
}

interface Feedback {
  type: 'issue' | 'strength' | 'suggestion';
  message: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ scores, isRecording }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const generateFeedback = () => {
      const newFeedback: Feedback[] = [];

      // Confidence feedback
      if (scores.confidence < 40) {
        newFeedback.push({
          type: 'issue',
          message: 'Low confidence detected. Try speaking more assertively.',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'high'
        });
      } else if (scores.confidence > 75) {
        newFeedback.push({
          type: 'strength',
          message: 'Great confidence level! Keep it up.',
          icon: <CheckCircle className="h-4 w-4" />,
          priority: 'low'
        });
      }

      // Enthusiasm feedback
      if (scores.enthusiasm < 35) {
        newFeedback.push({
          type: 'suggestion',
          message: 'Consider showing more enthusiasm in your responses.',
          icon: <Lightbulb className="h-4 w-4" />,
          priority: 'medium'
        });
      }

      // Stress feedback
      if (scores.stress > 70) {
        newFeedback.push({
          type: 'issue',
          message: 'High stress levels detected. Take deep breaths.',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'high'
        });
      }

      // Positivity feedback
      if (scores.positivity > 70) {
        newFeedback.push({
          type: 'strength',
          message: 'Excellent positive energy!',
          icon: <CheckCircle className="h-4 w-4" />,
          priority: 'low'
        });
      }

      // General suggestions
      if (scores.confidence > 60 && scores.enthusiasm > 60 && scores.stress < 40) {
        newFeedback.push({
          type: 'strength',
          message: 'Strong overall performance across all metrics.',
          icon: <TrendingUp className="h-4 w-4" />,
          priority: 'low'
        });
      }

      setFeedback(newFeedback);
    };

    generateFeedback();
  }, [scores]);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'issue':
        return 'destructive';
      case 'strength':
        return 'default';
      case 'suggestion':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      scores,
      feedback: feedback.map(f => f.message),
      overallScore: Math.round((scores.confidence + scores.enthusiasm + scores.positivity + (100 - scores.stress)) / 4)
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Real-time Feedback
          </CardTitle>
          <Button
            variant="analysis"
            size="sm"
            onClick={generateReport}
            disabled={isRecording}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Start your interview to receive real-time feedback</p>
          </div>
        ) : (
          feedback.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
            >
              <div className={getPriorityColor(item.priority)}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getBadgeVariant(item.type)} className="text-xs">
                    {item.type}
                  </Badge>
                  <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority} priority
                  </span>
                </div>
                <p className="text-sm text-foreground">{item.message}</p>
              </div>
            </div>
          ))
        )}

        {isRecording && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Analysis Active</span>
            </div>
            <p className="text-xs text-primary/80 mt-1">
              AI is analyzing your speech patterns, facial expressions, and body language in real-time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};