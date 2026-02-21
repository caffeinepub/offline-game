import { Button } from './ui/button';
import { Trophy, Trash2, ArrowLeft } from 'lucide-react';
import { useGameStorage } from '../hooks/useGameStorage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface HighScoresProps {
  onBack: () => void;
}

export default function HighScores({ onBack }: HighScoresProps) {
  const { getHighScores, clearScores } = useGameStorage();
  const scores = getHighScores();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-terracotta">High Scores</h1>
          <Trophy className="h-10 w-10 text-amber" />
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-lg">
          {scores.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">No scores yet. Start playing to set a record!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl bg-background p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? 'bg-terracotta text-white'
                          : index === 1
                            ? 'bg-amber text-white'
                            : index === 2
                              ? 'bg-sage text-white'
                              : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{entry.score}</p>
                      <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {index === 0 && <Trophy className="h-6 w-6 text-amber" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          {scores.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all scores?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your high scores will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearScores}>Clear All</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
