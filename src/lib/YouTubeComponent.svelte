<script lang="ts">
    import type { Comment } from '@/types.ts';
    let { sendResult }: { sendResult: (comments: Comment[]) => void } = $props();

    let error = $state('')
    let done = $state(false)
    let collectedComments = $state<Comment[]>([]);
    let commentAmounts = $derived(collectedComments.length)
    // let doneCollecting = $derived(collectedComments.len [])


    async function launchScraper() {
        console.log("clicked button");
        let result: Comment[] = await send('scrape')
        if (result.length == 0) {
            error = 'No comments found. This may be an error'
            return
        }
        collectedComments = result
        done = true
    }

    // from https://developer.chrome.com/docs/extensions/reference/api/tabs
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    async function send(msg: string) {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
        if (!tab?.id) throw new Error('No active tab found')
        let result = browser.tabs.sendMessage(tab.id, msg)
        console.log(result)
        return result
    }
    // async function sendFinal(msg: string): Promise<Comment[]> {
    //     const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    //     if (!tab?.id) throw new Error('No active tab found')
    //     let result = browser.tabs.sendMessage(tab.id, msg)
    //     console.log(result)
    //     return result
    // }


</script>

{#if !done}
    <button onclick={() => launchScraper()}>
        Launch scraper
    </button>
{:else}
    <p>Comments Collected: {commentAmounts}</p>
    <button onclick={() => {sendResult(collectedComments); done = false}}>
        Click here to download .csv file of the comments
    </button>
{/if}

<p>
    {error}
</p>
