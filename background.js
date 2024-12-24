
// receives signal from popup.js to start
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_timer") {
        // pre-cond: make sure `message` contains duration
        // const alarmTime = Date.now() + message.duration * 60 * 1000; // turn into seconds
        const alarmTime = Date.now() + 5*1000; // temporary for testing
        chrome.storage.local.set({ alarmTime });
        chrome.alarms.create("timerEnd", { when: alarmTime });
        console.log("Received. Timer started...");
        sendResponse({ status: "Timer started" });
    }
});

// notify popup timer is finished
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "timerEnd") {
        chrome.runtime.sendMessage({ action: "timer_finished" });
        console.log("Timer finished, notifying popup...");
    }
});

