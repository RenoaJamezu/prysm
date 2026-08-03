type SoundType = "new-order" | "completed" | "cancelled";

class SoundManager {
  private unlocked = false;

  private readonly sounds: Record<SoundType, HTMLAudioElement> = {
    "new-order": this.createAudio("/sounds/new-order.mp3"),
    completed: this.createAudio("/sounds/completed.mp3"),
    cancelled: this.createAudio("/sounds/cancelled.mp3"),
  };

  private createAudio(src: string) {
    const audio = new Audio(src);

    audio.preload = "auto";

    return audio;
  }

  async unlock() {
    if (this.unlocked) return;

    this.unlocked = true;

    for (const audio of Object.values(this.sounds)) {
      try {
        audio.muted = true;

        await audio.play();

        audio.pause();
        audio.currentTime = 0;

        audio.muted = false;
      } catch (error) {
        console.warn("Unable to unlock audio.", error);
      }
    }
  }

  async play(type: SoundType) {
    const audio = this.sounds[type];

    if (!audio) return;

    try {
      audio.pause();

      audio.currentTime = 0;

      await audio.play();
    } catch (error) {
      console.warn(`Unable to play "${type}" sound.`, error);
    }
  }

  playNewOrder() {
    return this.play("new-order");
  }

  playCompleted() {
    return this.play("completed");
  }

  playCancelled() {
    return this.play("cancelled");
  }
}

export const sound = new SoundManager();