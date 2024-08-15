<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import Highlight from "svelte-highlight"
  import ashes from "svelte-highlight/styles/ashes"
  import xml from "svelte-highlight/languages/xml"
  import Dialog from "$lib/components/Dialog.svelte";
  import AuthDialog from "$lib/components/AuthDialog.svelte";
  import FeedbackDialog from "$lib/components/FeedbackDialog.svelte";
  import { openLemonSqueezyUrl, getLemonSqueezy }from '$lib/helpers/lemonsqueezy'
  import AccountDialog from '$lib/components/AccountDialog.svelte';
  import { onMount } from 'svelte';

  export let data

  const siteTitle = "SvelteKit AI Wrapper"
  const siteDescription = "Site description..."
  const siteAuthor = "Berkay Çubuk"
  const siteAuthorLink = "https://berkaycubuk.com"
  const siteAuthorMail = "berkay@berkaycubuk.com"

  let showPlans = true
  let loadingFullPage = true
  let prompt = ""
  let settingsDialog = false
  let faqDialog = false
  let showResult = false
  let code = ""
  let openaiApiKey = ""
  let loading = false
  let promptError = ""
  let authDialog = false
  let feedbackDialog = false
  let accountDialog = false
  let manageSubLink = null
  let { supabase, session } = data
  $: ({ supabase, session } = data)

  onMount(() => {
	  fetchSub()
  })

  function fetchSub() {
	  fetch('/sub/active')
		.then(response => response.json())
		.then(json => {
			  if (json.subscription) {
				  showPlans = false
				  manageSubLink = "https://[your-store-name].lemonsqueezy.com/billing"
			  }
			  loadingFullPage = false
		})
  }

  function submit(e: any) {
    e.preventDefault()

    if (loading) return

    if (prompt == "" || prompt == null || prompt == undefined) {
      promptError = "Please write a prompt!"
      return
    }

    if (prompt.length > 300) {
      promptError = "Your prompt is too long, max 300 chars allowed."
      return
    }

    promptError = ""

    loading = true

    fetch("/generate", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      })
    }).then((response) => response.json())
      .then(json => {

        if (json.success == false) {
          promptError = json.error
          loading = false
          return
        }

        code = json.generation
        loading = false
      })
      .catch(err => console.error(err))

    showResult = true
  }

  function save() {
    if (openaiApiKey != null && openaiApiKey != "") {
      localStorage.setItem("cw-openai-api-key", openaiApiKey)
    }

    settingsDialog = false
  }

  function applyExample(value: any) {
    prompt = value
  }

  let exampleDialogs = [
    false,
    false,
    false
  ]

  function openDialog(index) {
    exampleDialogs[index] = true

    document.querySelector("body")?.classList.add("overflow-hidden")
  }

  function closeDialog(index) {
    exampleDialogs[index] = false

    document.querySelector("body")?.classList.remove("overflow-hidden")
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()

    console.error(error)
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      invalidateAll()
    }

    if (event == 'SIGNED_OUT') {
      invalidateAll()
    }
  })

  async function buyPro() {
    // LemonSquuezy product id
    const prod_id = ""
    const test_id = ""
	const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	const checkoutUrl =
		`https://[your-store-name].lemonsqueezy.com/checkout/buy/${prod_id}?` +
		new URLSearchParams({
			embed: "1",
			dark: isDarkMode ? "1" : "0",
			"checkout[email]": session.user.email,
			"checkout[custom][user_id]": session.user.id,
		}).toString();

    const lemon = await getLemonSqueezy()

	openLemonSqueezyUrl(checkoutUrl);

    lemon.Setup({
      eventHandler: (event) => {
        if (event.event == 'Checkout.Success') {
          fetch('/sub/purchase', {
            method: 'POST',
            body: JSON.stringify({
              order_id: event.data.order.data.id,
              customer_id: event.data.order.data.attributes.customer_id
            }),
            headers: {
              'Application-Type': 'application/json',
            },
          }).then(response => response.json())
            .then(json => {
		loadingFullPage = true
		fetchSub()
            })
        }
      }
    })
  }
</script>

<svelte:head>
  <title>{siteTitle}</title>
  <meta property="og:title" content={siteTitle} />
  <meta property="twitter:title" content={siteTitle} />

  <meta name="description" content={siteDescription} />
  <meta property="og:description" content={siteDescription} />
  <meta property="twitter:description" content={siteDescription} />

  <meta property="og:type" content="website" />

  {@html ashes}
</svelte:head>

<style>
@keyframes submitAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.submit-animation {
  animation-name: submitAnimation;
  animation-duration: 6s;
  animation-iteration-count: infinite;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
}
</style>

<div class="bg-black min-h-screen text-gray-300 font-light">
	{#if loadingFullPage}
	<div class="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center">
		<div class="">
		  <svg class="animate-spin mx-auto mt-6 h-10 w-10 text-white" viewBox="0 0 24 24">
		    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
		    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		  </svg>
		</div>
	</div>
	{/if}

  <div class="container mx-auto">
    <div class="p-6">

      <header class="flex items-center justify-between mb-10">
        <div class="text-xl font-semibold">
	{siteTitle}
	</div>
        <nav class="flex items-center gap-2">
          <button class="flex items-center gap-2 px-4 py-2 rounded bg-neutral-950 text-white font-medium hover:scale-105 transition-all border border-neutral-800 text-sm md:text-base" on:click|preventDefault={() => feedbackDialog = true}>
            Give feedback
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block lucide lucide-message-circle-more"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
          </button>
          <button class="flex items-center gap-2 px-4 py-2 rounded bg-neutral-950 text-white font-medium hover:scale-105 transition-all border border-neutral-800 text-sm md:text-base" on:click|preventDefault={() => accountDialog = true}>
	    Account
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden md:block lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </nav>
      </header>

	{#if showPlans}
      <p class="mt-20 text-center text-lg text-neutral-200">Subscribe to get started.</p>

      <div class="grid mt-10 max-w-[400px] mx-auto">

        <div class="bg-neutral-950 text-neutral-200 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Pro Plan</h2>
            <div class="flex gap-2 items-end">
              <div class="text-5xl font-semibold">€5</div>
              <div class="font-light text-lg">/ month</div>
            </div>
            <button class="mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg w-full hover:bg-blue-700 submit-animation font-medium flex items-center gap-2 hover:scale-105 transition-all" on:click|preventDefault={() => buyPro()}>
              Subscribe Now
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
            </button>
            <ul class="mt-6 flex flex-col gap-3">
                <li class="flex items-center gap-2 text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                  20 generation limit per hour
              </li>
                <li class="flex items-center gap-2 text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
		Your generations are private
              </li>
                <li class="flex items-center gap-2 text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                  7 day free trial
              </li>
            </ul>
        </div>

      </div>
	{:else}
      <h2 class="text-2xl font-semibold text-center text-gray-200 mt-20">{siteDescription}</h2>

      <div class="mt-10">

        <!--
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">

          <button on:click|preventDefault={() => applyExample('Hero section for my landing page')} class="px-3 py-2 bg-neutral-950 rounded border border-neutral-800">Hero section for my landing page</button>

          <button on:click|preventDefault={() => applyExample('Pricing with 3 plans')} class="px-3 py-2 bg-neutral-950 rounded border border-neutral-800">Pricing with 3 plans</button>

          <button on:click|preventDefault={() => applyExample('Contact form for my consultancy business')} class="px-3 py-2 bg-neutral-950 rounded border border-neutral-800">Contact form for my consultancy business</button>

        </div>
        -->

        <textarea class={"w-full bg-neutral-950 rounded-lg border outline-none p-4 font-light text-lg text-gray-300 " + (promptError != "" ? 'border-red-500' : 'border-neutral-800')} placeholder="Describe your component, section, button..." bind:value={prompt} maxlength="300"></textarea>
        {#if promptError != ""}
        <div class="text-red-500">{promptError}</div>
        {/if}

        {#if loading}
        <button disabled class="mt-2 px-4 py-3 rounded-lg bg-neutral-950 text-gray-200 border border-neutral-800 w-full submit-animation font-bold text-lg flex items-center gap-2 justify-center hover:scale-105 transition-all">
          Generating
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
        {:else}
        <button on:click={submit} class="mt-2 px-4 py-3 rounded-lg bg-neutral-950 text-gray-200 border border-neutral-800 w-full submit-animation font-bold text-lg flex items-center gap-2 justify-center hover:scale-105 transition-all">
          Generate
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>
        </button>
        {/if}

        {#if showResult}
          {#if !loading && code != ""}
          <Dialog generation={{
            prompt: prompt,
            generation: code,
          }} close={() => showResult = false} />
          {:else}
            <div class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-6">

              <div class="rounded-lg bg-neutral-950 p-6 max-w-[400px] w-full flex flex-col gap-4">

                <img src="https://i.giphy.com/a5viI92PAF89q.webp" />

                <p class="text-lg text-center text-neutral-200 animate-bounce">Loading your code...</p>

              </div>

            </div>
          {/if}
        {/if}

        {#if showResult}
        <div class="mt-4">
          {#if !loading && code != ""}
          <Highlight {code} language={xml} />
          {:else}
            <p class="text-lg">Loading your component, please be patient...</p>
          {/if}
        </div>
        {/if}

      </div>

      {#if authDialog}
        <AuthDialog close={() => authDialog = false} />
      {/if}

      <div class="flex items-center justify-between gap-4 mt-4">
        <p class="text-sm text-gray-300">Created by <a target="_blank" class="hover:underline" href={siteAuthorLink}>{siteAuthor}</a></p>

        <div class="flex items-center gap-4">
          <!--
          <a class="text-sm hover:underline cursor-pointer" on:click={() => settingsDialog = true}>Settings</a>
          -->
          <a class="text-sm hover:underline cursor-pointer" on:click={() => faqDialog = true}>F.A.Q.</a>
        </div>
      </div>

      <div class="text-2xl font-semibold text-neutral-200 mt-40 text-center">Recent generations</div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {#each data.generations as item, i}
        <div class="bg-neutral-950 p-4 rounded-lg h-fit">
            <div class="mb-4">
              <button class="flex items-center gap-2 hover:gap-4 transition-all bg-black text-white hover:bg-neutral-900 font-semibold py-2 px-4 border border-black rounded" on:click|preventDefault={() => openDialog(i)}>
                Show details
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              </button>
            </div>
            <div class="mb-4 italic">
              "{item.prompt}"
            </div>
            <div style="max-width: 80vw;">
              <Highlight code={item.generation} language={xml} />
            </div>
        </div>

        {#if exampleDialogs[i]}
          <Dialog generation={item} close={() => closeDialog(i)} />
        {/if}
      {/each}
      </div>

      {#if settingsDialog}
      <div class="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-6">

        <div class="rounded-lg bg-neutral-950 p-6 container w-full">

          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-200">Settings</div>
            <button on:click={() => settingsDialog = false}>Close</button>
          </div>

          <div class="mt-6">

            <div class="flex flex-col gap-4">

              <div class="flex flex-col gap-2">
                <label for="openai-api-key">OpenAI API Key</label>
                <input bind:value={openaiApiKey} type="text" id="openai-api-key" class="rounded-md bg-neutral-950 border border-neutral-800 outline-none p-4 font-light text-lg text-gray-300" placeholder="sk-xxxxxxxxxxxxxxxxx" />
              </div>

              <button on:click={save} class="mt-2 px-3 py-2 rounded-lg bg-neutral-950 text-gray-200 hover:bg-neutral-900 w-full">Save</button>

            </div>

          </div>

        </div>

      </div>
      {/if}

      {#if faqDialog}
      <div class="fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center p-6">

        <div class="rounded-lg bg-neutral-950 p-6 container w-full max-h-[60vh] overflow-y-auto">

          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-200"></div>
            <button on:click={() => faqDialog = false}>Close</button>
          </div>

          <div class="mt-6">

            <div class="flex flex-col gap-8">

              <article>

                <h3 class="text-xl font-semibold text-gray-200 mb-2">What is the hourly submission limit?</h3>
                <p>
                  Currently all free users have 3 submission per hour limit. If you want to upgrade, please get in touch <a class="underline" href={siteAuthorMail}>{siteAuthorMail}</a>.
                </p>

              </article>

              <article>

                <h3 class="text-xl font-semibold text-gray-200 mb-2">Are my prompts being stored?</h3>
                <p>
                  Yes, your prompts are stored. If you don't want them to be publicly visible, join the early access waitlist and get notified when it becomes available.
                </p>

              </article>

              <article>

                <h3 class="text-xl font-semibold text-gray-200 mb-2">Are my results being stored?</h3>
                <p>
                  Yes, your generation results are stored. If you don't want them to be publicly visible, join the early access waitlist and get notified when it becomes available.
                </p>

              </article>

              <article>

                <h3 class="text-xl font-semibold text-gray-200 mb-2">I want to self-host this web app, can I?</h3>
                <p>
                  No. If you want to self-host this web app, please get in touch with me <a class="underline" href={siteAuthorMail}>{siteAuthorMail}</a>.
                </p>

              </article>

            </div>

          </div>

        </div>

      </div>
      {/if}
	{/if}


      {#if feedbackDialog}
        <FeedbackDialog close={() => feedbackDialog = false} />
      {/if}


      {#if accountDialog}
        <AccountDialog close={() => accountDialog = false} supabase={supabase} showPlans={showPlans} manageSubLink={manageSubLink} />
      {/if}

    </div>
  </div>
</div>
