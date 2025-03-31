import { STORAGE_KEYS, DEFAULT_STORAGE, getValue, setValue} from "../storage.js";

console.log("Javascript file connected."); 

document.addEventListener("DOMContentLoaded", () => {
    // =================================================
    // CONSTANTS
    // =================================================

    // @TODO allow variables to be modified in settings
    const MIN_SETS = 1;
    const MAX_SETS = 8;

    // Timer
    let remainingTime;
    let timerInterval;

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

    /**
     * Replace data.remainingTime with this
     * Get the time from the running timer
     * @precond need to be running
     * @postcond sets the global variable, `remainingTime` as initialized
     */
    const getRemainingTime = () => {
        return new Promise((resolve) => {
            chrome.alarms.get("timerEnd", (alarm) => {
                if (alarm) {
                    remainingTime = Math.max(
                        0,
                        Math.floor((alarm.scheduledTime - Date.now()) / 1000)
                    );
                    console.log(
                        "Set `remainingTime` to:",
                        remainingTime,
                        "seconds"
                    );
                } else {
                    remainingTime = 0;
                    console.log("No alarm found. Set `remainingTime` to 0.");
                }
                resolve(remainingTime);
            });
        });
    };

    // UI Functions

    const pauseTimer = async () => {
        console.log("Pausing timer...");

        setValue(STORAGE_KEYS.IS_RUNNING, false);
        let phase = getValue(STORAGE_KEYS.PHASE); 
        switch (phase) {
            case "work": 
                setValue(STORAGE_KEYS.PHASE, "paused"); 
                console.log("Set phase to 'paused'");
                break; 

            case "shortBreak": 
                setValue(STORAGE_KEYS.PHASE, "shortBreakPaused");
                console.log("Set phase to 'shortBreakPaused'");
                break; 

            case "longBreak": 
                setValue(STORAGE_KEYS.PHASE, "longBreakPaused");
                console.log("Set phase to 'longBreakPaused'"); 
                break; 

            default: 
                // if not expected
                console.log("Unexpected phase case:", phase);
        }
        updateLocked(false); 
        startButton.textContent = "Start";
    }

    /**
     * Start a timer from the "idle" phase
     */
    const startTimer = async () => {
        console.log("Starting timer...");
        
        setValue(STORAGE_KEYS.IS_RUNNING, true);
        setValue(STORAGE_KEYS.PHASE, "work");
        updateLocked(true);
        startButton.textContent = "Pause";

        // local or remote or doesn't matter?
        remainingTime = parseInt(minuteSlider.value) * 60; // remainingTime = slider value
        console.log("Remaining time set to:", remainingTime);

        // Initialize the Background Timer (e.g. async time)
        await startBackgroundTimer(remainingTime);

        // Initialize the timerInterval (e.g. window time)
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime -= 1; 
                timerText.textContent = formatTime(remainingTime);
            }
            else {
                // insert remote updates
                clearInterval(timerInterval);
                startButton.textContent = "Start";
                // let service worker handle transition & notification
            }
        }, 1000);

    }

    // remainingTime? 
    // 1. Set on timer start, recalculate when opened
    // 2. Align with service worker and "extract" from service worker

    const startBackgroundTimer = async () => {
        chrome.runtime.sendMessage(
            { action: "start_timer", duration: remainingTime },
            (response) => {
                console.log("Background response:", response.status);
            }
        );
    }

    const resumeTimer = async () => {
        console.log("Resuming the timer...");


        timerText.textContent = formatTime(remainingTime);

        // take remainingTime and set a timerinterval
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime -= 1;
                timerText.textContent = formatTime(remainingTime);
            } else {
                // insert remote updates
                clearInterval(timerInterval);
                startButton.textContent = "Start";
                // let service worker handle transition & notification
            }
        }, 1000);
        
    }

    /**
     * Toggle timer on/off depending on the phase
     */
    const toggleTimer = async () => {
        let phase = await getValue(STORAGE_KEYS.PHASE);
        switch (phase) {
            case "paused":
                break;

            case "work":
            case "shortBreak":
            case "longBreak":
                // check isRunning here to track if break is paused
                await pauseTimer();
                break;

            case "idle":
            default:
                await startTimer();

        }
    }

    /**
     * Update the display of the options
     * @TODO event listener for options: if changed, save to local storage
     * @TODO make sets color in dots depending on how much there are
     * @param {*} param0
     */
    const updateOptionDisplay = ({
        minutes,
        shortBreak,
        longBreak,
        sets,
        filledSets,
    }) => {
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

        if (filledSets !== undefined) {
            Array.from(setContainer.children).forEach((dot, index) => {
                dot.classList.toggle("set_dot--dark", index < filledSets);
            });
        }
    };

    /**
     * Update the timer
     * @param {*} text
     */
    const updateTimer = (text) => {
        timerText.textContent = text;
    };

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
    };

    const updateDisplay = async (data) => {
        console.log("Updating Display given:", data);

        // First, update all options no matter the state
        updateOptionDisplay({
            minutes: data.minutes,
            shortBreak: data.shortBreak,
            longBreak: data.longBreak,
            sets: data.sets,
            filledSets: data.completedSets,
        });

        // Now, we filter based on the phase
        switch (data.phase) {
            case "paused":
                console.log("Paused Phase Detected...");
                // updateLocked(true);
                updateLocked(true);
                // updateTimer(remainingTime);
                updateTimer(formatTime(data.remainingTime));

                // @TODO update if paused? Can we pause an ongoing chrome timer? 
                // OR should we cancel the timer and save remainingTime? 
                // await getRemainingTime(); 
                // updateTimer(formatTime(remainingTime));

                // updateStartButton(data.phase);
                startButton.textContent = "Resume";
                break;

            case "work":
            case "shortBreak":
            case "longBreak":
                console.log("Active Phase Detected...");
                // updateLocked(true);
                updateLocked(true);
                // updateTimer(remainingTime);
                // updateTimer(formatTime(data.remainingTime));
                await getRemainingTime(); 
                updateTimer(formatTime(remainingTime));
                // updateStartButton(data.phase);
                startButton.textContent = "Pause";

                // if isRunning.isTrue: startTimer
                if (data.isRunning) {
                    await resumeTimer();
                }
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
        }
    };

    // =================================================
    // EVENT LISTENERS
    // =================================================

    // Event Listeners for slider options
    minuteSlider.addEventListener("input", async () => {
        const minutes = minuteSlider.value;
        minuteSliderValue.textContent = `${minutes}:00`;
        timerText.textContent = `${minutes}:00`;
        await setValue(STORAGE_KEYS.MINUTES, minutes);

        console.log("Changed remote storage minutes to", minutes);

    });

    shortBreakSlider.addEventListener("input", async () => {
        const shortBreak = shortBreakSlider.value; 
        shortBreakSliderValue.textContent = `${shortBreak}:00`; 
        await setValue(STORAGE_KEYS.SHORT_BREAK, shortBreak); 

        console.log("Changed remote storage shortBreak to", shortBreak);
    });

    longBreakSlider.addEventListener("input", async() => {
        const longBreak = longBreakSlider.value; 
        longBreakSliderValue.textContent = `${longBreak}:00`; 
        await setValue(STORAGE_KEYS.LONG_BREAK, longBreak); 

        console.log("Changed remote storage longBreak to", longBreak); 
    });

    // Event Listeners for set buttons (increment/decrement)
    setsLeftBtn.addEventListener("click", async () => {
        try {
            let sets = await getValue(STORAGE_KEYS.SETS);
            if (sets > MIN_SETS) {
                sets -= 1; 
                await setValue(STORAGE_KEYS.SETS, sets); 
                updateOptionDisplay({ sets:sets });
                console.log("Decreased sets value by 1 to", sets);
            } 
        }
        catch (err) {
            console.error("Error updating sets:", err);
        }
    });

    setsRightBtn.addEventListener("click", async () => {
        try {
            let sets = await getValue(STORAGE_KEYS.SETS); 
            if (sets < MAX_SETS) {
                sets += 1; 
                await setValue(STORAGE_KEYS.SETS, sets); 
                updateOptionDisplay({ sets:sets }); 
                console.log("Increased sets value by 1 to", sets);
            }
        }
        catch (err) {
            console.error("Error updating sets:", err);
        }
    });

    startButton.addEventListener("click", async () => {
        await toggleTimer();
    });

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
                await updateDisplay(DEFAULT_STORAGE);
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
                await updateDisplay(data);
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
    initializeSettings(); // this is async btw-- async if need to wait
});