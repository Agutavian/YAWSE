
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

Download the extension for your browser from ![releases](test.com)


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

### Firefox:
### Chrome:
### Other:
Idk




> [!TIP]
> Youtube and Instagram will require you to scroll down manually if you want to record all the comments. Once you have loaded all the comments you want, then click scrape