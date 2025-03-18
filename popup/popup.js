import { STORAGE_KEYS, DEFAULT_STORAGE, getValue, setValue} from "../storage.js";

console.log("Javascript file connected."); 

document.addEventListener("DOMContentLoaded", () => {
    // =================================================
    // CONSTANTS
    // =================================================
  

    // =================================================
    // ENTRYPOINTS
    // =================================================

    const initializeSettings = async () => {
        console.log("initializing settings...");

        try {
            // retrieve ALL data
            const keys = [
                STORAGE_KEYS.MINUTES,
                STORAGE_KEYS.SHORT_BREAK,
                STORAGE_KEYS.LONG_BREAK,
                STORAGE_KEYS.SETS,
                STORAGE_KEYS.IS_RUNNING,
                STORAGE_KEYS.REMAINING_TIME,
                STORAGE_KEYS.PHASE,
                STORAGE_KEYS.COMPLETED_SETS,
            ];
            const data = await getValue(keys);
            
            const missingKeys = keys.filter(key => data[key] === undefined);

            // Case 1: if all data is missing, use defaults
            if (missingKeys.length == keys.length) {
                console.log("No data found. New user detected. Initializing with default settings...");
            }

            // Case 2: if partial data, throw error (unexpected)
            else if (missingKeys.length > 0) {
                throw new error(`Incomplete data received. Missing keys: ${missingKeys.join(",")}`);
            }

            // Case 3: All keys exist-- resume session
            else {
                console.log("All data found. Resuming session...");
            }

        } 
        catch (error) {
            console.error("Error during initialization:", error);
            // revert to default settings
            await chrome.storage.local.set(DEFAULT_STORAGE);
            // update UI
        }
    };

    /* Run logs and tests */
    const runTests = async () => {
        // 1. Test getters / setters
        console.log("---Testing getters & setters ---");
        await setValue(STORAGE_KEYS.COMPLETED_SETS, 5);
        console.assert(
        (await getValue(STORAGE_KEYS.COMPLETED_SETS)) == 5,
        "Test failed: Set value is incorrect"
        );
        await chrome.storage.local.remove(STORAGE_KEYS.COMPLETED_SETS);
        console.log("---Finished testing getters & setters---");
    };

    // runTests();
    initializeSettings();
});