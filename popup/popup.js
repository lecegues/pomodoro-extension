import { STORAGE_KEYS, DEFAULT_STORAGE} from "../constants.js";

console.log("Javascript file connected."); 

document.addEventListener("DOMContentLoaded", () => {
    // =================================================
    // CONSTANTS
    // =================================================

    // =================================================
    // UTILITY FUNCTIONS
    // =================================================

    /*
    Helper function to retrieve storage data
    */
    const _getStorageData = async () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(
                [STORAGE_KEYS.OPTIONS, STORAGE_KEYS.TIMER_STATE],
                    (data) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    if (!data[STORAGE_KEYS.OPTIONS]) {
                        console.warn(
                        `Missing ${STORAGE_KEYS.OPTIONS} data. Using default options.`
                        );
                    }
                    if (!data[STORAGE_KEYS.TIMER_STATE]) {
                        console.warn(
                        `Missing ${STORAGE_KEYS.TIMER_STATE} data. Using default timer state.`
                        );
                    }

                    // if values are missing, add on default values
                    const options = {
                        ...DEFAULT_STORAGE.options,
                        ...data[STORAGE_KEYS.OPTIONS],
                    };
                    const timerState = {
                        ...DEFAULT_STORAGE.timerState,
                        ...data[STORAGE_KEYS.TIMER_STATE],
                    };
                    resolve({ options, timerState });
                }
            );
        });
    };

    /*
    Main function to retrieve storage data
    Returns: an object with two properties (options, timerState)
        Usage: data.options.minutes, data.timerState.isRunning (refer to constants.js)
    */
    const getStorageData = async () => {
        try {
            const data = await _getStorageData();
            console.log("Retrieved data: ", data);
            return data;
        }
        catch (error) {
            console.error("Error retrieving storage data", error);
            throw error;
        }
    };

    /*
    Usage:
        1. Updating ENTIRE structures:
        (async () => {
            try {
                const newOptions = {
                minutes: 30,
                shortBreak: 6,
                longBreak: 20,
                sets: 5
                };

                await setStorageData({ [STORAGE_KEYS.OPTIONS]: newOptions });
                console.log("Options updated successfully!");
            } catch (error) {
                console.error("Error updating storage data:", error);
            }
        })();

        2. Updating a SINGLE field:
        (async () => {
            try {
                const data = await getStorageData();
                // Modify only the 'minutes' value
                const updatedOptions = {
                ...data.options,
                minutes: 45
                };

                await setStorageData({ [STORAGE_KEYS.OPTIONS]: updatedOptions });
                console.log("Minutes updated successfully!");
            } catch (error) {
                console.error("Error updating minutes:", error);
            }
        })();
    */
    const _setStorageData = async (data) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    };

    const setStorageData = async (sectionKey, updateData, merge = true) => {
        try {
            if (sectionKey != STORAGE_KEYS.OPTIONS || sectionKey != STORAGE_KEYS.TIMER_STATE) {
                throw error("Invalid sectionKey");
            }
            if (merge) {
                const data = await getStorageData();
                // merge updates
                const newSectionData = { ...data[sectionKey], ...updateData };
                await setStorageData({ [sectionKey]: newSectionData });
                console.log(
                  `Section ${sectionKey} updated successfully (merged).`
                );
            }
            else {
                await setStorageData({ [sectionKey]: updateData });
                 console.log(
                   `Section ${sectionKey} updated successfully (replaced).`
                 );
            }
        }
        catch (error) {
            console.error(`Error updating section ${sectionKey}:`, error);
        }

    };

    /* */
    const initializeSettings = async () => {
        console.log("initializing settings...");
        // 1. Check if values are missing
        // - if ALL values are missing (first time opening), then replace
        // - if a partial value is missing (something went wrong)
    };

    /* Run logs and tests */
    const runTests = async () => {
        // 1. Test getStorageData
        console.log("---Testing getStorageData...---");
        await getStorageData();
        console.log("---Finished testing getStorageData...---");

        // 2. Test setStorageData
        console.log("---Testing setStorageData...---");

        console.log("---Finished testing setStorageData...---");
    };

    runTests();
});