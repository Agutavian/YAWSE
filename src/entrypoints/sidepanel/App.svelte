<script lang="ts">
  import type { Comment } from '@/types.ts';
  import TwitterComponent from "@/lib/TwitterComponent.svelte";
  import Papa from 'papaparse';
  import InstagramComponent from "@/lib/InstagramComponent.svelte";
  import YouTubeComponent from "@/lib/YouTubeComponent.svelte";
  import NoneComponent from "@/lib/NoneComponent.svelte";
  import { currentTab } from '@/lib/CurrentTab.ts';

  const PAGES = {
    YOUTUBE: 0,
    INSTAGRAM: 1,
    TWITTER: 2,
    NONE: 3
  }

  let current_page: number = $derived.by(()=> {
    if ($currentTab == null){
      return PAGES.NONE
    }else if ($currentTab.url == undefined) {
      return PAGES.NONE
    }else if ($currentTab.url.includes('youtube.com') && $currentTab.url.includes('watch?')) {
      return PAGES.YOUTUBE
    }else if ($currentTab.url.includes('x.com') && $currentTab.url.includes('/status/') || $currentTab.url.includes('twitter.com') && $currentTab.url.includes('/status/')) {
      return PAGES.TWITTER
    }else if ($currentTab.url.includes('instagram.com') && $currentTab.url.includes('/p/')) {
      return PAGES.INSTAGRAM
    }else {
      return PAGES.NONE
    }
  })


  function downloadCSV(collectedComments: Comment[]) {
    const csv = Papa.unparse(collectedComments, {escapeFormulae:true})
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', "comments.csv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

</script>

<!--{current_page}-->
<!--{$currentTab?.url}-->
<!--{#if current_page === PAGES.TWITTER}-->
<!--  twitter-->
THESE WILL ONLY WORK ON THE POSTS OF THE RESPECTIVE WEBSITES: JUST TEST RN
IF ON TWITTER:
  <TwitterComponent sendResult={(result) => downloadCSV(result)} />
  <!--{:else if current_page === PAGES.INSTAGRAM}-->
<!--  instagram-->

IF ON INSTAGRAM:
    <InstagramComponent sendResult={(result) => downloadCSV(result)} />
  <!--{:else if current_page === PAGES.YOUTUBE}-->
<!--  youutube-->
IF ON YOUTUBE:
    <YouTubeComponent sendResult={(result) => downloadCSV(result)} />
  <!--{:else}-->
<!--  none-->
<!--    <NoneComponent />-->
<!--{/if}-->