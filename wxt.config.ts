import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  webExt: {
    binaries: {
      chrome: '/usr/bin/ungoogled-chromium',
    },
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
  },
  manifest: {
    action: {
      default_title: "yet-another-website-scraping-extension",
    },
    permissions: ['activeTab', 'scripting', 'sidePanel'],
  },
});
