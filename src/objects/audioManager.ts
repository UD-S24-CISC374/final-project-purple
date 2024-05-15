import Phaser from "phaser";

class AudioManager {
    private static instance: AudioManager;
    private currentMusic: Phaser.Sound.WebAudioSound | null = null;

    private constructor() {}

    public static getInstance(): AudioManager {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public playMusic(
        scene: Phaser.Scene,
        key: string,
        config: Phaser.Types.Sound.SoundConfig = {}
    ): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        this.currentMusic = scene.sound.add(key, {
            ...config,
            loop: true,
        }) as Phaser.Sound.WebAudioSound;
        this.currentMusic.play();
    }

    public stopMusic(): void {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    public setVolume(volume: number): void {
        if (this.currentMusic) {
            this.currentMusic.setVolume(volume);
        }
    }
}

export default AudioManager.getInstance();
