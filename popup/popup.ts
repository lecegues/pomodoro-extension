console.log("JavaScript file connected!");

document.addEventListener("DOMContentLoaded", () => {

    // define chrome storage key values
    const STORAGE_KEYS = {
      TIMERSTATE: {
        key: "timerState",
        defaultValue: {
          isRunning: false,
          remainingTime: 0,
          phase: "idle", // idle, paused, work, shortBreak, longBreak
          completedSets: 0,
        }
      },
      OPTIONS: {
        key: "options",
        defaultValue: {
          minutes: 30,
          shortBreak: 5,
          longBreak: 15,
          sets: 4,
        }
      }
    }

    const STORAGE_KEYS2 = {
      KEYS: {
        TIMER_STATE
      }
    }



    // define lower and upper limit for sets
    // @TODO could be modified in settings in future
    const MIN_SETS = 1; 
    const MAX_SETS = 8; 
    const DEFAULT_SETS = 4; 

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

    // @TODO change start_button id in HTML
    const toggleButton = document.getElementById("start_button");

    /* Utility functions for CRUD chrome storage */ 
    const getStorageObjData = async(keyObj) => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(keyObj.key, (result) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(result[keyObj.key] || keyObj.defaultValue); 
        })
      })
    }


    const getStorageData = async (keys) => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve(result);
        });
      });
    };

    const setStorageData = async (data) => {
        return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
            }
            resolve();
        });
        });
    };




});