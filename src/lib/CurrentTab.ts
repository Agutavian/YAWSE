import { readable } from 'svelte/store';

export const currentTab = readable<Browser.tabs.Tab | null>(null, (set) => {
    const refresh = async () => {
        const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
        set(tab ?? null);
    };

    refresh();

    browser.tabs.onActivated.addListener(refresh);
    browser.tabs.onUpdated.addListener(refresh);
    browser.windows.onFocusChanged.addListener(refresh);

    return () => {
        browser.tabs.onActivated.removeListener(refresh);
        browser.tabs.onUpdated.removeListener(refresh);
        browser.windows.onFocusChanged.removeListener(refresh);
    };
});