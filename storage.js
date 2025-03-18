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
  minutes: 25, // minutes
  shortBreak: 5, // minutes
  longBreak: 15, // minutes
  sets: 4, 
  isRunning: false,
  remainingTime: 0, // seconds
  phase: "idle", // idle, paused, work, shortBreak, longBreak
  completedSets: 0,
};

/**
 * Retrieve a single OR multiple values 
 * @param {string|Array<string>} keys - single key or array of keys
 * @returns A promise that resolves to the value
 * Usage (single): const x = await getValue(STORAGE_KEYS.MINUTES);
 * Usage (multiple): const y = await getvalue([STORAGE_KEYS.MINUTES, STORAGE_KEYS.SHORT_BREAK]);
 */
export const getValue = async (keys) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            
            // if it was a single key, then resolve a single result
            if (typeof keys === "string") {
                resolve(result[keys]);
            } 
            // otherwise, give an object
            else {
                resolve(result);
            }
        });
    });
};

/**
 * Set a single value OR multiple values given a key
 * @param {string|Object} key - single key or an object containing key-value pairs
 * @param {*} value - a value to set ONLY if its a SINGLE key
 * @returns A promise that resolves to the value
 * Usage (single): await setValue(STORAGE_KEYS.MINUTES, 30);
 * Usage (multiple): await setValue(DEFAULT_STORAGE);
 */
export const setValue = async (key, value) => {
    return new Promise((resolve, reject) => {
        // if key is an object, use it directly
        const data = typeof key === 'object' ? key : { [key]: value };
        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}