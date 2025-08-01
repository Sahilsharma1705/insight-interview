import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Camera, Mic, MicOff, VideoOff, BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { EmotionChart } from './EmotionChart';
import { FeedbackPanel } from './FeedbackPanel';
import { ScoreCard } from './ScoreCard';

interface EmotionScores {
  confidence: number;
  enthusiasm: number;
  stress: number;
  positivity: number;
}

interface InterviewSession {
  isRecording: boolean;
  duration: number;
  emotionHistory: Array<{ timestamp: number; scores: EmotionScores }>;
  currentScores: EmotionScores;
}

export const InterviewDashboard = () => {
  const [session, setSession] = useState<InterviewSession>({
    isRecording: false,
    duration: 0,
    emotionHistory: [],
    currentScores: {
      confidence: 0,
      enthusiasm: 0,
      stress: 0,
      positivity: 0
    }
  });

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate real-time emotion analysis
  useEffect(() => {
    if (!session.isRecording) return;

    intervalRef.current = setInterval(() => {
      setSession(prev => {
        const newScores: EmotionScores = {
          confidence: Math.max(0, Math.min(100, prev.currentScores.confidence + (Math.random() - 0.5) * 10)),
          enthusiasm: Math.max(0, Math.min(100, prev.currentScores.enthusiasm + (Math.random() - 0.5) * 8)),
          stress: Math.max(0, Math.min(100, prev.currentScores.stress + (Math.random() - 0.5) * 12)),
          positivity: Math.max(0, Math.min(100, prev.currentScores.positivity + (Math.random() - 0.5) * 6))
        };

        return {
          ...prev,
          duration: prev.duration + 1,
          currentScores: newScores,
          emotionHistory: [
            ...prev.emotionHistory,
            { timestamp: prev.duration, scores: newScores }
          ].slice(-60) // Keep last 60 seconds
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session.isRecording]);

  const startRecording = () => {
    setSession(prev => ({
      ...prev,
      isRecording: true,
      currentScores: {
        confidence: 50 + Math.random() * 20,
        enthusiasm: 40 + Math.random() * 30,
        stress: 20 + Math.random() * 15,
        positivity: 60 + Math.random() * 25
      }
    }));
  };

  const stopRecording = () => {
    setSession(prev => ({ ...prev, isRecording: false }));
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverallScore = () => {
    const { confidence, enthusiasm, positivity, stress } = session.currentScores;
    return Math.round((confidence + enthusiasm + positivity + (100 - stress)) / 4);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Analysis</h1>
            <p className="text-muted-foreground">Real-time multimodal sentiment analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={session.isRecording ? "destructive" : "secondary"} className="text-sm">
              {session.isRecording ? "LIVE" : "STANDBY"}
            </Badge>
            <div className="text-2xl font-mono text-foreground">
              {formatTime(session.duration)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Video Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                      <VideoOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={session.isRecording ? "destructive" : "recording"}
                    size="lg"
                    onClick={session.isRecording ? stopRecording : startRecording}
                    className="flex-1"
                  >
                    {session.isRecording ? (
                      <>
                        <Square className="h-4 w-4" />
                        Stop Interview
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Interview
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="analysis"
                    size="lg"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                  >
                    {cameraEnabled ? <Camera className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="analysis"
                    size="lg"
                    onClick={() => setMicEnabled(!micEnabled)}
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotion Scores */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Real-time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <ScoreCard 
                    title="Confidence" 
                    score={session.currentScores.confidence}
                    color="primary"
                    icon={TrendingUp}
                  />
                  <ScoreCard 
                    title="Enthusiasm" 
                    score={session.currentScores.enthusiasm}
                    color="success"
                    icon={CheckCircle}
                  />
                  <ScoreCard 
                    title="Stress" 
                    score={session.currentScores.stress}
                    color="warning"
                    icon={AlertCircle}
                    inverted
                  />
                  <ScoreCard 
                    title="Positivity" 
                    score={session.currentScores.positivity}
                    color="accent"
                    icon={CheckCircle}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Overall Score</h3>
                    <span className="text-2xl font-bold text-primary">{getOverallScore()}/100</span>
                  </div>
                  <Progress value={getOverallScore()} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotion Timeline */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Emotion Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionChart data={session.emotionHistory} />
            </CardContent>
          </Card>

          {/* Feedback Panel */}
          <FeedbackPanel 
            scores={session.currentScores}
            isRecording={session.isRecording}
          />
        </div>
      </div>
    </div>
  );
};