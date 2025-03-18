export const STORAGE_KEYS = {
  OPTIONS: "options",
  TIMER_STATE: "timerState",
};

export const DEFAULT_STORAGE = {
  options: {
    minutes: 25,
    shortBreak: 5,
    longBreak: 15,
    sets: 4,
  },
  timerState: {
    isRunning: false,
    remainingTime: 0,
    phase: "idle", // idle | paused | work | shortBreak | longBreak
    completedSets: 0,
  },
};
