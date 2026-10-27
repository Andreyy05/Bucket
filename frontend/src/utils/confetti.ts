import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  // První výstřel ze středu
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Následný déšť konfet ze stran
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  }, 200);
}
