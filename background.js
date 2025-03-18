
/*
// `start_timer`: listener to start the timer
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_timer") {
        // pre-cond: make sure `message` contains duration
        // const alarmTime = Date.now() + message.duration * 60 * 1000; // turn into seconds
        const alarmTime = Date.now() + 5*1000; // temporary for testing

        chrome.storage.local.set ( {alarmTime} , () => {
            if (chrome.runtime.lastError) {
                console.error("Error setting alarmTime", chrome.runtime.lastError);
                sendResponse({ status: "Error setting alarm"} );
                return;
            }

            // create alarm
            chrome.alarms.create("timerEnd", { when: alarmTime });

            console.log(`Timer set for ${message.duration} minutes`);
            sendResponse({ status: "Timer started" });
        });

        return true;
    }
});

// `stop_timer`: pause/cancel the timer (alarm)
// once start is pressed again, take new date with remaining time and update it

// `cancel_timer`: cancel the current alarm/timer

// notify popup timer is finished
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "timerEnd") {
        console.log("Timer finished");

        // send notification to user
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png', // Ensure this icon exists
            title: 'Pomodoro Timer',
            message: 'Your Pomodoro session has finished! Click here to open the timer.',
            priority: 2
        }, (notificationId) => {
            console.log("Notification shown with ID:", notificationId);
        });

        chrome.runtime.sendMessage({ action: "timer_finished" });
    }
});

*/