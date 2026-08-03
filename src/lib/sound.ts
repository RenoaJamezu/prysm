let newOrderAudio: HTMLAudioElement | null = null;
let completedAudio: HTMLAudioElement | null = null;
let cancelledAudio: HTMLAudioElement | null = null;

function getNewOrderAudio() {
  if (!newOrderAudio) {
    newOrderAudio = new Audio("/sounds/new-order.mp3");
  }

  return newOrderAudio;
}

function getCompletedAudio() {
  if (!completedAudio) {
    completedAudio = new Audio("/sounds/completed.mp3");
  }

  return completedAudio;
}

function getCancelledAudio() {
  if (!cancelledAudio) {
    cancelledAudio = new Audio("/sounds/cancelled.mp3");
  }

  return cancelledAudio;
}

async function play(audio: HTMLAudioElement) {
  try {
    audio.currentTime = 0;
    await audio.play();
  } catch {
    // Ignore autoplay errors
  }
}

export function playNewOrderSound() {
  return play(getNewOrderAudio());
}

export function playCompletedSound() {
  return play(getCompletedAudio());
}

export function playCancelledSound() {
  return play(getCancelledAudio());
}
