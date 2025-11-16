import os
import pygame
from typing import Dict, Optional

class AudioManager:
    def __init__(self,
                 music_path: Optional[str] = None,
                 sfx_paths: Optional[Dict[str, str]] = None,
                 music_volume: float = 0.2,
                 sfx_volume: float = 1.0,
                 pre_init_params: tuple = (48000, -16, 1, 1024)):
        """
        Initialize the audio manager.

        - music_path: path to looping background music file (or None)
        - sfx_paths: dict mapping names to sound file paths, e.g., {"jump": "assets/jump.wav"}
        - music_volume: 0.0 - 1.0
        - sfx_volume: 0.0 - 1.0
        - pre_init_params: args to pygame.mixer.pre_init(...)
        """
        self.music_path = music_path
        self.sfx_paths = sfx_paths or {}
        self.music_volume = music_volume
        self.sfx_volume = sfx_volume
        self._sounds: Dict[str, pygame.mixer.Sound] = {}

        # Initialize pygame mixer with recommended order
        pygame.mixer.pre_init(*pre_init_params)
        pygame.init()
        if not pygame.mixer.get_init():
            pygame.mixer.init()

        # Load assets
        self._load_assets()

        # Start music if a path was provided and file exists
        if self.music_path and os.path.exists(self.music_path):
            try:
                pygame.mixer.music.load(self.music_path)
                pygame.mixer.music.set_volume(self.music_volume)
            except pygame.error as e:
                print(f"AudioManager: failed to load music '{self.music_path}': {e}")

    def _load_assets(self):
        # Load SFX
        for name, path in self.sfx_paths.items():
            if not os.path.exists(path):
                print(f"AudioManager: SFX '{name}' path not found: {path}")
                continue
            try:
                sound = pygame.mixer.Sound(path)
                sound.set_volume(self.sfx_volume)
                self._sounds[name] = sound
            except pygame.error as e:
                print(f"AudioManager: failed to load SFX '{name}' from '{path}': {e}")

    def play_music(self, loop: int = -1):
        """Start playing music. 'loop' uses -1 for infinite loop in pygame."""
        if not self.music_path or not os.path.exists(self.music_path):
            print("AudioManager: No music loaded to play.")
            return
        try:
            if not pygame.mixer.music.get_busy():
                pygame.mixer.music.play(loop)
        except pygame.error as e:
            print(f"AudioManager: error playing music: {e}")

    def pause_music(self):
        """Pause music if playing."""
        try:
            if pygame.mixer.music.get_busy():
                pygame.mixer.music.pause()
        except pygame.error as e:
            print(f"AudioManager: error pausing music: {e}")

    def resume_music(self):
        """Resume paused music."""
        try:
            pygame.mixer.music.unpause()
        except pygame.error as e:
            print(f"AudioManager: error resuming music: {e}")

    def stop_music(self):
        """Stop music playback."""
        try:
            pygame.mixer.music.stop()
        except pygame.error as e:
            print(f"AudioManager: error stopping music: {e}")

    def play_sfx(self, name: str):
        """Play a sound effect by its registered name."""
        sound = self._sounds.get(name)
        if not sound:
            print(f"AudioManager: SFX '{name}' not found.")
            return
        try:
            sound.play()
        except pygame.error as e:
            print(f"AudioManager: error playing SFX '{name}': {e}")

    def set_music_volume(self, vol: float):
        self.music_volume = max(0.0, min(1.0, vol))
        try:
            pygame.mixer.music.set_volume(self.music_volume)
        except pygame.error as e:
            print(f"AudioManager: error setting music volume: {e}")

    def set_sfx_volume(self, vol: float):
        self.sfx_volume = max(0.0, min(1.0, vol))
        for name, snd in self._sounds.items():
            try:
                snd.set_volume(self.sfx_volume)
            except pygame.error as e:
                print(f"AudioManager: error setting volume for SFX '{name}': {e}")

    def shutdown(self):
        """Graceful shutdown of the mixer."""
        try:
            if pygame.mixer.get_init():
                pygame.mixer.music.stop()
                pygame.mixer.quit()
        except Exception:
            pass
        try:
            pygame.quit()
        except Exception:
            pass

    # Convenience: check if music is playing
    def is_music_playing(self) -> bool:
        return pygame.mixer.music.get_busy()
import pygame
import sys
from audio_manager import AudioManager

def main():
    # Audio setup
    music_path = "assets/game_bgm.ogg"
    sfx_paths = {
        "jump": "assets/jump.wav",
        "hit": "assets/hit.wav",
    }

    audio = AudioManager(
        music_path=music_path,
        sfx_paths=sfx_paths,
        music_volume=0.25,
        sfx_volume=0.9
    )

    # Start music
    audio.play_music(-1)

    # Pygame window setup (your game loop would be here)
    pygame.display.set_mode((640, 480))
    pygame.display.set_caption("Game with AudioManager")

    clock = pygame.time.Clock()
    running = True

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    audio.play_sfx("jump")
                elif event.key == pygame.K_p:
                    if audio.is_music_playing():
                        audio.pause_music()
                    else:
                        audio.resume_music()
                elif event.key == pygame.K_m:
                    audio.stop_music()

        # Your game logic and rendering here
        pygame.display.flip()
        clock.tick(60)

    audio.shutdown()
    sys.exit()

if __name__ == "__main__":
    main() 

