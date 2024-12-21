console.log("JavaScript file connected!");

document.addEventListener("DOMContentLoaded", () => {

    // define local storage key values
    const STORAGE_KEYS = {
        MINUTES: 'minutes',
        SHORT_BREAK: 'shortBreak',
        LONG_BREAK: 'longBreak',
        SETS: 'sets',
    };

    // define lower and upper limit for sets
    const MIN_SETS = 1;
    const MAX_SETS = 8;
    const DEFAULT_SETS = 4; // if not saved in localStorage

    // DOM Elements
    const minuteSlider = document.getElementById("minute_slider");
    const minuteSliderValue = document.getElementById("minute_slider_value");

    const shortBreakSlider = document.getElementById("short_break_slider");
    const shortBreakSliderValue = document.getElementById("short_break_slider_value");

    const longBreakSlider = document.getElementById("long_break_slider"); 
    const longBreakSliderValue = document.getElementById("long_break_slider_value"); 

    const setsValue = document.getElementById("sets_value");
    const setsLeftBtn = document.getElementById("left_button");
    const setsRightBtn = document.getElementById("right_button");
    const setContainer = document.getElementById("set_container");

    const timerText = document.getElementById("timer_text");
    const startButton = document.getElementById("start_button");

    // timer variables
    let isRunning = false;
    let timerInterval = null; 
    let remainingTime = 0;

    /**
     * Initialize settings from localStorage / default value
     */
    const initializeSettings = () => {
        const minutes = parseInt(localStorage.getItem(STORAGE_KEYS.MINUTES)) || 30;
        const shortBreak = parseInt(localStorage.getItem(STORAGE_KEYS.SHORT_BREAK)) || 5;
        const longBreak = parseInt(localStorage.getItem(STORAGE_KEYS.LONG_BREAK)) || 15;

        minuteSlider.value = minutes;
        shortBreakSlider.value = shortBreak;
        longBreakSlider.value = longBreak;

        minuteSliderValue.textContent = `${minutes}:00`;
        shortBreakSliderValue.textContent = `${shortBreak}:00`;
        longBreakSliderValue.textContent = `${longBreak}:00`;

        // Initialize sets
        let sets = parseInt(localStorage.getItem(STORAGE_KEYS.SETS));
        if (isNaN(sets)) {
            sets = DEFAULT_SETS;
            localStorage.setItem(STORAGE_KEYS.SETS, sets);
        }
        updateSetDisplay(sets);

        // @TODO should change dynamically decrementing
        timerText.textContent = formatTime(minutes * 60);
    };

    /**
     * Update sets display and number
     * @param {number} sets 
     */
    const updateSetDisplay = (sets) => {
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

    /**
     * Save a key-value pair to local storage
     * @param {} key 
     * @param {*} value 
     */
    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
    }

    /**
     * Format time in seconds to mm:ss format
     * @param {*} seconds 
     * @returns 
     */
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /**
     * Starts countdown timer
     */
    const startTimer = () => {
        if (isRunning) return; // make sure its only running once

        isRunning = true;
        lockSliders(true); // @TODO
        startButton.textContent = "Pause";

        // Initialize remainingTime based on settings
        const minutes = parseInt(minuteSlider.value);
        remainingTime = minutes * 60;

        timerText.textContent = formatTime(remainingTime);

        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime -= 1;
                timerText.textContent = formatTime(remainingTime);
            }
            else {
                clearInterval(timerInterval);
                isRunning = false;
                lockSliders(false);
                startButton.textContent = "Start";
            }
        }, 1000);
    };

    /**
     * Pauses the timer
     * @returns
     */
    const pauseTimer = () => {
        if (!isRunning) return;

        clearInterval(timerInterval);
        isRunning = false;
        lockSliders(false);
        startButton.textContent = "Start";
    }

    const toggleTimer = () => {
        if (isRunning) {
            pauseTimer();
        }
        else {
            startTimer();
        }
    }

    /**
     * Toggles disabled/enabled state
     * @param {boolean} lock 
     */
    const lockSliders = (lock) => {
        minuteSlider.disabled = lock;
        shortBreakSlider.disabled = lock;
        longBreakSlider.disabled = lock; 
        setsLeftBtn.disabled = lock; 
        setsRightBtn.disabled = lock;
    }

    // Event listeners for sliders
    minuteSlider.addEventListener("input", () => {
        const minutes = minuteSlider.value;
        minuteSliderValue.textContent = `${minutes}:00`;
        saveToLocalStorage(STORAGE_KEYS.MINUTES, minutes);

        // change main timer text as well
        timerText.textContent = `${minutes}:00`;
    });
    
    shortBreakSlider.addEventListener("input", () => {
        const shortBreak = shortBreakSlider.value;
        shortBreakSliderValue.textContent = `${shortBreak}:00`;
        saveToLocalStorage(STORAGE_KEYS.SHORT_BREAK, shortBreak);
    });

    longBreakSlider.addEventListener("input", () =>{
        const longBreak = longBreakSlider.value;
        longBreakSliderValue.textContent = `${longBreak}:00`;
        saveToLocalStorage(STORAGE_KEYS.LONG_BREAK, longBreak);
    });

    // Event Listener for set buttons (increment/decrement)
    setsLeftBtn.addEventListener("click", () =>{
        let sets = parseInt(localStorage.getItem(STORAGE_KEYS.SETS)) || DEFAULT_SETS;
        if (sets > MIN_SETS) {
            sets -= 1;
            saveToLocalStorage(STORAGE_KEYS.SETS, sets);
            updateSetDisplay(sets);
        }
    });

    setsRightBtn.addEventListener("click", () => {
        let sets = parseInt(localStorage.getItem(STORAGE_KEYS.SETS)) || DEFAULT_SETS;
        if (sets < MAX_SETS) {
            sets += 1;
            saveToLocalStorage(STORAGE_KEYS.SETS, sets);
            updateSetDisplay(sets);
        }
    });

    startButton.addEventListener("click", toggleTimer);

    initializeSettings();

});