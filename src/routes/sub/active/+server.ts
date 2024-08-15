export async function GET({ request, getClientAddress, locals: { supabase, session } }) {
    const ip = request.headers.get('x-forwarded-for') || getClientAddress();

	if (!session) {
		return new Response(JSON.stringify({
			success: false,
			error: "No active session.",
		}), { status: 400 });
	}

	const { data, error } = await supabase.from("user_plans").select().eq("user_id", session.user.id)

	if (error) {
		console.error(error)
	}

	console.log(data)

	if (data.length == 0) {
		return new Response(JSON.stringify({
			success: true,
			subscription: null,
		}), { status: 200 });
	}

	// Return a response
	return new Response(JSON.stringify({
		success: true,
		subscription: data[0],
	}), { status: 200 });
}
