export async function POST({ request }) {
    const data = await request.json();

    // Process the data (e.g., save to database, etc.)
    console.log('Received data:', data);

    // Return a response
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
