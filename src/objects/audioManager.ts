import Phaser from "phaser";

class audioManager {
    private static instance: audioManager;
    private music: Phaser.Sound.BaseSound | null = null;

    private constructor() {}

    public static getInstance(): audioManager {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!audioManager.instance) {
            audioManager.instance = new audioManager();
        }
        return audioManager.instance;
    }

    public playMusic(
        scene: Phaser.Scene,
        key: string,
        config: Phaser.Types.Sound.SoundConfig = {}
    ): void {
        if (!this.music) {
            this.music = scene.sound.add(key, { ...config, loop: true });
            this.music.play();
        } else if (!this.music.isPlaying) {
            this.music.play();
        }
    }

    public stopMusic(): void {
        if (this.music) {
            this.music.stop();
        }
    }

    public setVolume(volume: number): void {
        if (this.music && this.music instanceof Phaser.Sound.WebAudioSound) {
            this.music.setVolume(volume);
        }
    }
}

export default audioManager.getInstance();
