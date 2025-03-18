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

    const minuteSlider = document.getElementById("minute_slider");
    const minuteSliderValue = document.getElementById("minute_slider_value");

    const shortBreakSlider = document.getElementById("short_break_slider");
    const shortBreakSliderValue = document.getElementById(
        "short_break_slider_value"
    );

    const longBreakSlider = document.getElementById("long_break_slider");
    const longBreakSliderValue = document.getElementById(
        "long_break_slider_value"
    );

    const setsValue = document.getElementById("sets_value");
    const setsLeftBtn = document.getElementById("left_button");
    const setsRightBtn = document.getElementById("right_button");
    const setContainer = document.getElementById("set_container");

    const timerText = document.getElementById("timer_text");
    const startButton = document.getElementById("start_button");

    // =================================================
    // FUNCTIONS
    // =================================================

    // Utility Functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // UI Functions

    /**
     * Update the display of the options
     * @TODO event listener for options: if changed, save to local storage
     * @TODO make sets color in dots depending on how much there are
     * @param {*} param0 
     */
    const updateOptionDisplay = ({ minutes, shortBreak, longBreak, sets }) => {
        if (minutes !== undefined) {
            minuteSlider.value = minutes; 
            minuteSliderValue.textContent = `${minutes}:00`;
        }

        if (shortBreak !== undefined) {
            shortBreakSlider.value = shortBreak; 
            shortBreakSliderValue.textContent = `${shortBreak}:00`;
        }

        if (longBreak !== undefined) {
            longBreakSlider.value = longBreak; 
            longBreakSliderValue.textContent = `${longBreak}:00`;
        }

        if (sets !== undefined) {
            setsValue.textContent = `${sets}`;

            // clear existing dots
            setContainer.innerHTML = "";

            // create elements based on number of sets
            for (let i = 0; i < sets; i++) {
                const dot = document.createElement("span");
                dot.classList.add("set_dot");
                setContainer.appendChild(dot);
            }
        }

    };

    /**
     * Update the timer
     * @param {*} text 
     */
    const updateTimer = (text) => {
        timerText.textContent = text;
    }

    /**
     * Update sliders to locked or unlocked state
     * @param {Boolean} lock
     */
    const updateLocked = (lock) => {
        minuteSlider.disabled = lock;
        shortBreakSlider.disabled = lock;
        longBreakSlider.disabled = lock;
        setsLeftBtn.disabled = lock;
        setsRightBtn.disabled = lock;
    }

    const updateDisplay = (data) => {
        console.log("Updating Display given:", data);

        // First, update all options no matter the state
        updateOptionDisplay({
            minutes: data.minutes,
            shortBreak: data.shortBreak,
            longBreak: data.longBreak,
            sets: data.sets,
        });

        // Now, we filter based on the phase
        switch (data.phase) {
            case "paused":
                console.log("Paused Phase Detected...");
                // updateLocked(true);
                updateLocked(true);
                // updateTimer(remainingTime);
                updateTimer(formatTime(data.remainingTime));
                // updateStartButton(data.phase);
                startButton.textContent = "Resume"; 
                // updateCompletedSets(completedSets);
                break;

            case "work":
            case "shortBreak":
            case "longBreak":
                console.log("Active Phase Detected...");
                // updateLocked(true);
                updateLocked(true);
                // updateTimer(remainingTime);
                updateTimer(formatTime(data.remainingTime));
                // updateStartButton(data.phase); 
                startButton.textContent = "Pause";
                // updateCompletedSets(completedSets);
                // if isRunning.isTrue: startTimer
                // if isRunning.isFalse: (this means that its just finished. Middle of transitioning to next phase)...
                break;

            case "idle":
            default:
                console.log("Idle Phase Detected (clean slate)...");
                updateLocked(false);
                // updateTimer(data.minutes);
                updateTimer(formatTime(data.minutes * 60));
                // updateStartButton(data.phase); 
                startButton.textContent = "Start";
                // updateCompletedSets(completedSets);
        }

    }

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
                updateDisplay(DEFAULT_STORAGE);
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
                updateDisplay(data);
            }

        } catch (error) {
            console.error("Error during initialization:", error);
            console.log("Reverting back to default settings...");
            await setValue(DEFAULT_STORAGE);
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