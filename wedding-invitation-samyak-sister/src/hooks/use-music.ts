import { useCallback, useEffect, useRef, useState } from "react";

export type MusicState = "idle" | "playing" | "muted";

/** A gentle looped melody, synthesised in the browser so there is no track to host. */
const MELODY = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
const NOTE_EVERY_MS = 1100;
const MUTE_FADE_SECS = 0.4;

type LegacyWindow = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Background music, kept entirely client-side.
 * `start` must run inside the guest's tap or key press: phones only allow sound to begin there.
 */
export function useMusic() {
  const context = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const timer = useRef<number | null>(null);
  const step = useRef(0);
  const muted = useRef(false);
  const [state, setState] = useState<MusicState>("idle");

  const stopNotes = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  }, []);

  const playNotes = useCallback(() => {
    const note = () => {
      const ctx = context.current;
      const gain = master.current;
      if (!ctx || !gain) return;
      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = MELODY[step.current++ % MELODY.length] ?? 261.63;
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.045, now + 0.08);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
      oscillator.connect(envelope);
      envelope.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 2.5);
    };
    stopNotes();
    note();
    timer.current = window.setInterval(note, NOTE_EVERY_MS);
  }, [stopNotes]);

  useEffect(
    () => () => {
      stopNotes();
      void context.current?.close();
    },
    [stopNotes],
  );

  /** Begins playing now; the volume rises from silence over `riseSec`, starting after `delaySec`. */
  const start = useCallback(
    (delaySec = 0, riseSec = 2.1) => {
      if (context.current) return;
      const AudioContextCtor = window.AudioContext ?? (window as LegacyWindow).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      const from = ctx.currentTime + Math.max(0, delaySec);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0, from);
      gain.gain.linearRampToValueAtTime(1, from + Math.max(0.05, riseSec));
      context.current = ctx;
      master.current = gain;
      muted.current = false;
      void ctx.resume();
      playNotes();
      setState("playing");
    },
    [playNotes],
  );

  /** Mutes or unmutes with a short fade; starts the music if it has not begun yet. */
  const toggle = useCallback(() => {
    const ctx = context.current;
    const gain = master.current;
    if (!ctx || !gain) {
      start(0, 0.6);
      return;
    }
    muted.current = !muted.current;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(muted.current ? 0 : 1, now + MUTE_FADE_SECS);
    if (muted.current) {
      // stop scheduling notes and let the audio hardware sleep once the fade is done
      stopNotes();
      window.setTimeout(
        () => {
          if (muted.current) void ctx.suspend();
        },
        MUTE_FADE_SECS * 1000 + 50,
      );
      setState("muted");
    } else {
      void ctx.resume();
      playNotes();
      setState("playing");
    }
  }, [start, stopNotes, playNotes]);

  return { state, start, toggle };
}
