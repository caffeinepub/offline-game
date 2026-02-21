import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useAudioManager } from '../hooks/useAudioManager';

export default function AudioControls() {
  const { settings, setMusicVolume, setSfxVolume, toggleMute } = useAudioManager();

  return (
    <div className="space-y-4 rounded-xl bg-card p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
        <Button onClick={toggleMute} variant="outline" size="icon">
          {settings.isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Music Volume</label>
            <span className="text-sm text-amber">{Math.round(settings.musicVolume * 100)}%</span>
          </div>
          <Slider
            value={[settings.musicVolume]}
            onValueChange={([value]) => setMusicVolume(value)}
            max={1}
            step={0.1}
            disabled={settings.isMuted}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Sound Effects</label>
            <span className="text-sm text-amber">{Math.round(settings.sfxVolume * 100)}%</span>
          </div>
          <Slider
            value={[settings.sfxVolume]}
            onValueChange={([value]) => setSfxVolume(value)}
            max={1}
            step={0.1}
            disabled={settings.isMuted}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
