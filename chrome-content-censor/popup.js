// Load saved words when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['censoredWords'], (result) => {
    const wordList = document.getElementById('wordList');
    if (result.censoredWords) {
      wordList.value = result.censoredWords.join('\n');
    }
  });
});

// Save words when save button is clicked
document.getElementById('saveButton').addEventListener('click', () => {
  const wordList = document.getElementById('wordList');
  const words = wordList.value
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);

  // Save to storage
  chrome.storage.local.set({ censoredWords: words }, () => {
    // Try to notify any active tabs
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        try {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'UPDATE_WORDS',
            words: words
          }).catch(() => {
            // Ignore any messaging errors - the storage update is what matters most
            console.log('Tab update not possible, but words are saved');
          });
        } catch (e) {
          // Ignore any messaging errors - the storage update is what matters most
          console.log('Tab update not possible, but words are saved');
        }
      }
    });

    // Visual feedback that save was successful
    const saveButton = document.getElementById('saveButton');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    saveButton.style.backgroundColor = '#45a049';
    setTimeout(() => {
      saveButton.textContent = originalText;
      saveButton.style.backgroundColor = '#4CAF50';
    }, 1000);
  });
});
