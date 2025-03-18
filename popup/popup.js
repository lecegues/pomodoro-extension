import { STORAGE_KEYS, DEFAULT_STORAGE, getValue, setValue} from "../storage.js";

console.log("Javascript file connected."); 

document.addEventListener("DOMContentLoaded", () => {
    // =================================================
    // CONSTANTS
    // =================================================

    // @TODO allow variables to be modified in settings
    const MIN_SETS = 1;
    const MAX_SETS = 8;

    // =================================================
    // DOM ELEMENTS
    // =================================================

    // =================================================
    // FUNCTIONS
    // =================================================

    // =================================================
    // ENTRYPOINTS
    // =================================================

    const initializeSettings = async () => {
        console.log("initializing settings...");

        try {
            // retrieve ALL data
            const keys = Object.values(STORAGE_KEYS);
            const data = await getValue(keys);

            const missingKeys = keys.filter((key) => data[key] === undefined);

            // Case 1: if all data is missing, use defaults
            if (missingKeys.length == keys.length) {
                console.log(
                    "No data found. New user detected. Initializing with default settings..."
                );
                await setValue(DEFAULT_STORAGE);
            }

            // Case 2: if partial data, throw error (unexpected)
            else if (missingKeys.length > 0) {
                throw new Error(
                    `Incomplete data received. Missing keys: ${missingKeys.join(
                        ","
                    )}`
                );
            }

            // Case 3: All keys exist-- resume session
            else {
                console.log("All data found. Resuming session...");
            }

        } catch (error) {
            console.error("Error during initialization:", error);
            console.log("Reverting back to default settings...");
            await setValue(DEFAULT_STORAGE);
        }

        // after, update the display
        // updateDisplay

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