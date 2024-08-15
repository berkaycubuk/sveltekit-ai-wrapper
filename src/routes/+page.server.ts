//import { supabase } from "$lib/supabaseClient";

import { redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export async function load({ locals: { supabase, session }}) {
	const { data } = await supabase.from("generations").select().eq("is_public", true).order('created_at', { ascending: false }).limit(100);

	let result = []

	if (data) {
		result = data.sort(() => Math.random() - 0.5).slice(0,3)
	}

	return {
	  generations: result ?? [],
	};
}
