
export interface Options {
    minutes: number; 
    shortBreak: number; 
    longBreak: number; 
    sets: number;
}

export interface TimerState {
    isRunning: boolean; 
    remainingTime: number; 
    phase: "idle" | "paused" | "work" | "shortBreak" | "longBreak";
    completedSets: number;
}

export interface StorageData {
    options: Options;
    timerState: TimerState;
}