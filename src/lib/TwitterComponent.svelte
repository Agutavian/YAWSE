<script lang="ts">
    import type { Comment } from '@/types.ts';
    let { sendResult }: { sendResult: (comments: Comment[]) => void } = $props();

    let initialised = $state(false)
    let recording = $state(false)
    let error = $state('')

    let collectedComments = $state<Comment[]>([]);
    let commentAmounts = $derived(collectedComments.length)
    // let doneCollecting = $derived(collectedComments.len [])




    async function launchScraper() {
        console.log(" clickedd button");
        let result = await send('scrape')
        if (result === true) {
            initialised = true
        }
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
    async function sendFinal(msg: string): Promise<Comment[]> {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
        if (!tab?.id) throw new Error('No active tab found')
        let result = browser.tabs.sendMessage(tab.id, msg)
        console.log(result)
        return result
    }


    async function startRecording() {
        try {
            await send('start_recording')
            recording = true
            error = ''
        } catch {
            error = 'Reload the X tab and try again.'
        }
    }

    async function stopRecording() {
        try {
            collectedComments = await sendFinal('stop_recording')

            recording = false

            console.log('result:', collectedComments)
        } catch {
            error = 'Reload the X tab and try again.'
        }
    }


</script>

{#if !initialised}
    <button onclick={() => launchScraper()}>
        Launch scraper
    </button>
{/if}

{#if initialised && commentAmounts==0}

    <button onclick={() => startRecording()} disabled={recording}>
        Start recording
    </button>
    <button onclick={() => stopRecording()} disabled={!recording}>
        Stop recording
    </button>
{/if}
{#if commentAmounts>0}
    <p>Comments Collected: {commentAmounts}</p>
    <button onclick={() => sendResult(collectedComments)}>
        Click here to download .csv file of the comments
    </button>
{/if}


<p>
    {error}
</p>
