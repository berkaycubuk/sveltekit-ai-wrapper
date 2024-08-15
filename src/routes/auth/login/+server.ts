

export async function POST({ request, getClientAddress, locals: { supabase } }) {
    const request_data = await request.json()
    const email = request_data.email

    const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
			},
		})

	console.log(data)
	console.log(error)

	return new Response(JSON.stringify({
		success: true,
	}), { status: 200 });
}
