// some inspirtation from https://gist.github.com/gd3kr/948296cf675469f5028911f8eb276dbc
import type {Comment} from '../types.ts'

export default defineContentScript({
    matches: ['*://*.x.com/*', '*://*.twitter.com/*'],
    runAt: 'document_end',
    async main() {
        console.log('main() loaded')
        browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
            console.log("beep boop signal received")


            switch (msg) {
                case 'scrape':
                    scrapeInit(document).then(() => sendResponse(true))
                    return true
                case 'start_recording':
                    startRecording().then(() => sendResponse(true))
                    return true
                case 'stop_recording':
                    stopRecording()
                    compileTwitter()
                        .then((result) => sendResponse(result))
                        .catch((e) => sendResponse({ error: String(e) }));
                    return true
                default:
                    return
            }
        })
    }
})


let currentReplies: Element[]
let allRawRepliesHTMLParent: Element
let allRawReplies: HTMLCollection
let observer: MutationObserver | null = null;



async function scrapeInit(document: Document) {
    console.log("scraping starting!")

    // Find element that has the aria label of conversation
    const conversationNode = document.querySelector('div[aria-label="Timeline: Conversation"]');
    if (!conversationNode) {
        console.error('Could not find aria-label="Timeline: Conversation"]')
        return
    }
    // normally, it only has one child who then has a children of all the replies. This gets all replies by getting 1st child and then getting all of it's children
    let allRawRepliesHTMLCollectionTemp = conversationNode?.firstElementChild
    if (!allRawRepliesHTMLCollectionTemp) {
        console.error('Could not find _allRawRepliesHTMLCollection')
        return
    }
    allRawRepliesHTMLParent = allRawRepliesHTMLCollectionTemp
    const conversationSubchildren = allRawRepliesHTMLCollectionTemp.children
    // Shouldn't happen :pray:
    if (!conversationSubchildren) {
        console.error('Could not find replies and its children.')
        return
    }

    allRawReplies = conversationSubchildren
    // console.log(Array.from(conversationSubchildren))

    // init
    updateReplies()


    // const replies = document.querySelectorAll('ul:has(> :nth-child(2))');
}

function updateReplies() {
    currentReplies = Array.from(allRawReplies)
}

function deltaMutationObserver(mutationsList: MutationRecord[], observer: MutationObserver) {
    for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) currentReplies.push(node)
        }
    }
}

async function startRecording() {
    currentReplies = Array.from(allRawRepliesHTMLParent.children)
    console.log("stop recording")
    await stopRecording() // you never know
    // FROM https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    // since x unloads its comments when not in view-frame, we just keep adding them until user stops
    observer = new MutationObserver(deltaMutationObserver);
    observer.observe(allRawRepliesHTMLParent, {childList: true})
}

async function stopRecording() {
    console.log("stop recording")
    // console.log(currentReplies)
    observer?.disconnect();
    observer = null;
}

async function compileTwitter(): Promise<Comment[]>{
    console.log("compiling twitter data")

    const replies = currentReplies
        .filter((element, index) => {
            // Filters out the 1st item, which is just the post itself
            if (index === 0){
                return false
            }
            // get the 1st child
            const first = element.firstElementChild?.firstElementChild
            // console.log(first)

            // Get the child if it exist. Actual replies have a 2nd child inside
            const bastards = first?.children.length
            if (bastards == undefined) {
                return false
            }
            // if it has more than one child, good on them
            return true
        }) // if the child of the possible class has children, keep.



    let ogposter: string = (() => {
        return document.querySelector('div[data-testid="User-Name"]')?.querySelector('span')?.querySelector('span')?.textContent?.trim() ?? ''
    })();


    let compiledReplies: Comment[] = []
    for (const element of replies) {
        let username = (() => {
            let outerdiv = element.querySelector('div[data-testid="User-Name"]')
            let innerSpan = outerdiv?.querySelector('span')?.querySelector('span')
            let text = innerSpan?.innerText ?? ''
            console.log(text)
            return text
        })();

        let text = (() => {
            // element.querySelector('div[data-testid="tweetText"]')?.querySelector(':scope > div')?.innerText ?? ''
            let outerdiv = element.querySelector('div[data-testid="tweetText"]')
            const text = outerdiv?.firstElementChild?.textContent?.trim() ?? '';
            console.log(text)
            return text
        })();

        let likes: number = (() => {
            // element.querySelector('div[data-testid="tweetText"]')?.querySelector(':scope > div')?.innerText ?? ''
            let likebutton = element.querySelector('button[data-testid="like"]')
            let aria = likebutton?.getAttribute('aria-label') ?? '';
            let likeRegex = aria.match(/(\d+)/);
            if (likeRegex) {
                let number: number = Number(likeRegex[0])
                console.log('Likes:', number)
                return number
            } else {
                console.log('No likes found :(')
                return -1
            }
        })();


        // no point in saving if we have don't text
        if (text === '') {
            console.log('No text found :(')
            continue
        }
        let comment: Comment = {
            username: username,
            text: text,
            likes: likes,
            hyperlink: location.href,
            posterofthepost: ogposter
        }

        if (compiledReplies.some(c =>
            c.username === comment.username &&
            c.text === comment.text &&
            c.hyperlink === comment.hyperlink
        )) {
            continue
        }
        compiledReplies.push(comment)

    }


    // console.log(compiledReplies)
    console.log("Origional Replies:", currentReplies.length)
    console.log("New Replies:", replies.length)

    return compiledReplies

}
