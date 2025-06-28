"use client";

import { useState, useEffect } from 'react';

// This hook preloads an audio file and provides a function to play it.
export default function useSound(soundUrl) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // This effect runs once to create the audio object.
    const audioInstance = new Audio(soundUrl);
    audioInstance.preload = 'auto';
    setAudio(audioInstance);

    // Cleanup function to prevent memory leaks
    return () => {
        audioInstance.src = '';
    };
  }, [soundUrl]);

  const playSound = () => {
    if (audio) {
      audio.currentTime = 0; // Rewind to the start
      audio.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  return playSound;
}