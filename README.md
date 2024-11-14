# Chrome Content Censor Extension

A Chrome extension that automatically removes div elements containing specified words from web pages.

## Features

- **Instant Content Blocking**: Removes unwanted content as soon as the page starts loading
- **Real-time Updates**: Censors dynamically loaded content automatically
- **Persistent Settings**: Saves your list of censored words between browser sessions
- **User-friendly Interface**: Simple popup interface to manage censored words
- **No Content Flashing**: Smooth transitions prevent censored content from briefly appearing
- **Error Handling**: Robust error handling ensures words are always saved properly

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `chrome-content-censor` folder

## Usage

1. Click the extension icon in Chrome's toolbar
2. Enter words to censor (one per line) in the text area
3. Click "Save Words" to apply changes
4. Browse the web - any div containing your specified words will be automatically removed

## Technical Details

The extension consists of four main components:

### manifest.json
- Defines extension metadata and permissions
- Configures content script to run at document_start
- Sets up necessary Chrome extension permissions

### popup.html/js
- Provides user interface for managing censored words
- Handles word list storage and updates
- Includes visual feedback for save operations
- Implements robust error handling

### content.js
- Performs the actual content censoring
- Uses MutationObserver to handle dynamic content
- Implements immediate content blocking during page load
- Manages smooth transitions to prevent content flashing

## How It Works

1. The extension injects a content script at document_start
2. Initially hides all divs with a CSS transition
3. Loads the censored word list from chrome.storage
4. Scans the page for divs containing censored words
5. Removes matching divs and shows remaining content
6. Continues monitoring for dynamic content changes

## Permissions Used

- `storage`: For saving censored word list
- `activeTab`: For accessing current tab content
- `scripting`: For injecting content scripts

## License

MIT License - feel free to use this code in your own projects!
