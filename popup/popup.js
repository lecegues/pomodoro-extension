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
    // 1. Check if values are missing
    // - if ALL values are missing (first time opening), then replace
    // - if a partial value is missing (something went wrong)
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

  runTests();
});