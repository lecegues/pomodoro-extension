export const STORAGE_KEYS = {
  MINUTES: "minutes",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
  SETS: "sets",
  IS_RUNNING: "isRunning",
  REMAINING_TIME: "remainingTime",
  PHASE: "phase",
  COMPLETED_SETS: "completedSets",
};

export const DEFAULT_STORAGE = {
  minutes: 25,
  shortBreak: 5,
  longBreak: 15,
  sets: 4,
  isRunning: false,
  remainingTime: 0,
  phase: "idle",
  completedSets: 0,
};

/**
 * Retrieve a single value given a key
 * @param {*} key - from STORAGE_KEYS
 * @returns A promise that resolves to the value
 * Usage: const x = await getValue(STORAGE_KEYS.MINUTES);
 */
export const getValue = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], data => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(data[key]);
        });
    });
}

/**
 * Set a single value given a key
 * @param {*} key - from STORAGE_KEYS
 * @param {*} value - a value to set (refer to STORAGE_KEYS)
 * @returns A promise that resolves to the value
 * Usage: await setValue(STORAGE_KEYS.MINUTES, 30);
 */
export const setValue = async (key, value) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}