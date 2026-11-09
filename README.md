
<div style="text-align: center;">
  <img src="/src/assets/icon.svg" alt="Logo" width="200">
</div>


# YAWSE (Yet Another Website Scraping Extension)

Another  browser extension that scrapes stuff from your current active tab

## License
[Licensed under the "Do What the Fuck You Want to" Public License](/LICENSE)


## Features

- Scrapes the Youtube, Instagram, or X comments on the page you're on
- Downloads as CSV after with username, text, likes, hyperlink, and the root poster's username



## Installation

Download the extension for your browser from [releases](https://github.com/Agutavian/YAWSE/releases)

### Firefox:
1. Type `about:debugging#/runtime/this-firefox` into your URL bar and press enter
2. Click "Load temporary add-ons"
3. Select the downloaded zip file that you selected (should be called "yawse-*-firefox.zip" or similar)
4. Done!
>[!WARNING]
> The extension will be unloaded when you close the browser. You must follow these step each time you re-open your browser (but you only need to install the extension from releases once)
### Chrome:
1. Unzip the downloaded file (the one you downloaded from releases, should be called "yawse-*-chrome.zip" or similar). Often done by clicking the downloaded file and clicking "unzip" or "extract"
2. Type `chrome://extensions/` into your URL bar and press enter
3. Toggle "Developer mode" on top right corner
4. Click "load unpacked"
5. Done!
### Other:
TODO

### Manual
From the root of the extracted source code:

    bun install --frozen-lockfile
    bun run zip:firefox

`bun install` also runs `wxt prepare` automatically, which generates the
`.wxt/` directory with TypeScript types.

`bun run zip:firefox` is defined in `package.json` as `wxt zip -b firefox`.
It builds the Firefox (Manifest V3) extension with WXT/Vite and packages it.
#### Output

- `.output/firefox-mv3/` contains the unpacked built extension.
- `.output/<name>-<version>-firefox.zip` is the extension package that
  was submitted. The build should produce a package identical to it.


## Usage Instructions

### Instagram && Youtube
> [!TIP]
> Youtube and Instagram will require you to scroll down manually if you want to record all the comments. Once you have loaded all the comments you want, then click scrape

> [!CAUTION]
> On Instagram, it only works on posts clicked on the feel that have been popped up. Not the full-screen posts
1. Click the extension icon (may be in your extension menu next to url bar) to open up the sidebar
2. Click on the post
3. Click on "Launch scraper"
4. Click on "Click here to download .csv file of the comments"
5. Done!

### Twitter/x
1. Open the target post
2. Click on "Launch scraper"
3. Click "Start recording"
4. Scroll till you have all the comments you would like to record
5. Click "Stop recording"
6. Click on "Click here to download .csv file of the comments"
7. Done!

