<script>
	export let close

	let email = ""
	let loading = false
	let mailSent = false

	async function submit() {
		loading = true
		const response = await fetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
			})
		})

		const response_json = await response.json()

		console.log(response_json)
		if (response_json.success == false) {
			loading = false
			return
		}

		loading = false
		mailSent = true
	}
</script>

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

<div class="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black/80">

	<div class="rounded-lg bg-neutral-950 p-6 max-w-[400px] w-full">

          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-200"></div>
            <button on:click={() => close()}>Close</button>
          </div>

		<div class="mt-4">

		{#if loading}
		<h2 class="text-center text-xl font-semibold text-neutral-200 mb-4">Sending mail...</h2>
		  <svg class="animate-spin mx-auto mt-6 h-10 w-10 text-white" viewBox="0 0 24 24">
		    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
		    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		  </svg>
		{:else}
			{#if mailSent}
			<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW16c25rZDR2eXd6cHh0NXdzdDJ1MW96cDE0OG11aThybTcxc2VvNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/efyEShk2FJ9X2Kpd7V/giphy.webp" />
			<h2 class="text-center text-xl font-semibold text-neutral-200 mb-4 mt-6">Check your mail!</h2>
			<p class="text-center">We sent you a magic link, with that you can login. Make sure to check spam folder.</p>
			{:else}
			<h2 class="text-center text-xl font-semibold text-neutral-200 mb-4">Start generating more!</h2>

			<div class="flex flex-col gap-4">

				<input type="email" class="p-3 bg-neutral-900 rounded-lg border border-neutral-800 outline-none focus:outline-blue-500" placeholder="Type your email" bind:value={email} />

				<button class="flex justify-center items-center gap-2 px-4 py-3 rounded bg-sky-400 text-white font-medium submit-animation hover:scale-105 transition-all text-sm md:text-base" on:click|preventDefault={() => submit()}>
					Get started
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
				</button>

			</div>
			{/if}
		{/if}

		</div>

	</div>

</div>
