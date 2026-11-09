import type {Comment} from "@/types.ts";

export default defineContentScript({
    matches: ['*://*.youtube.com/*'],
    runAt: 'document_end',
    async main() {
        console.log('Instagram main() loaded')
        browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
            console.log("beep boop signal received")


            switch (msg) {
                case 'scrape':
                    scrapeInit(document).then((result) => sendResponse(result))
                    return true
                default:
                    return
            }
        })
    }
})

async function scrapeInit(document: Document): Promise<Comment[]> {
    let rawComments: NodeListOf<Element> = await getAllComments()
    // No comments found
    if (rawComments == undefined){
        return []
    }

    let poster = await getPoster()
    let comments: Comment[] = []
    for (let item of rawComments) {
        let data = await getCommentData(item)
        if (data != undefined) {
            data.posterofthepost = poster
            comments.push(data)
        }
    }
    console.log("comments", comments)
    return comments

}

async function getAllComments(){
    // id of the comments section is 'content'
    return document.querySelectorAll('ytd-comment-thread-renderer')
}

async function getPoster(): Promise<string>{
    // PolarisPost/optionsButton class is the sibling of the header div. Go back one from that button, and then look for a (which is the header)
    let img_usrname_div = document.getElementsByClassName("PolarisPost/optionsButton")[0]?.previousElementSibling
    // 2nd child is the header one
    let username_div = img_usrname_div?.children[1]?.querySelector('span')?.querySelector('a')?.querySelector('span')
    if (username_div) {
        console.log(username_div)
        // let username = getComputedStyle(username_div, '::after').content
        let username = username_div.innerText
        console.log("Poster:", username)
        return username
    } else {
        return ''
    }

    // let username = username_a?.innerText ?? ''

}

async function getCommentData(element: Element): Promise<Comment | undefined>{
    let username: string = (() => {
        let username_span = element.querySelector('a')?.querySelector('span')
        // console.log(username_a)
        console.log("username", username_span?.textContent)
        return username_span?.textContent ?? ''
    })();

    let text: string = (() => {
        let text_spawn = element.querySelector('yt-attributed-string.ytd-comment-view-model')
        console.log("text", text_spawn)
        console.log(text_spawn?.textContent)
        return text_spawn?.textContent ?? ''
    })();

    let likes: number = (() => {
        let bottom_post_info = element.querySelector('ytd-comment-engagement-bar')?.firstElementChild
        // 2nd child
        let text_span = bottom_post_info?.children[1] as HTMLSpanElement | undefined
        console.log(text_span)
        let likes = text_span?.innerText
        if (likes) {
            let likeRegex = likes.match(/(\d+)/);
            if (likeRegex) {
                let number: number = Number(likeRegex[0])
                console.log('Likes:', number)
                return number
            }
        }
        console.log('No likes found :(')
        return 0
    })();
    // no point keeping data if no text
    if (text == ''){
        return undefined
    }
    return {
        username: username,
        text: text,
        posterofthepost: 'test',
        likes: likes,
        hyperlink: location.href
    }
}