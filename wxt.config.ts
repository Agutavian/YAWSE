import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  webExt: {
    binaries: {
      chrome: '/temp/browsers/chrome/linux-116.0.5845.96/chrome-linux64/chrome',
    },
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
  },
  manifest: ({ browser }) => ({
    description:
        'Another website scraping (browser) extension that scrapes stuff from your current active tab',
    action: {
      default_title: 'YAWSE',
    },
    permissions: [
      'activeTab',
      'scripting',
      ...(browser === 'chrome' ? ['sidePanel'] : []),
    ],
    browser_specific_settings: {
      gecko: {
        id: 'agutavian@thundermail.com',
        // strict_min_version: '115.0',
        data_collection_permissions: { required: ['none'] },
      },
    },
  }),
});