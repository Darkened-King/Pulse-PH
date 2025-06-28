import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // In a real application, you would send this message to an AI service
    // or your backend for processing. For now, we'll just echo it back
    // with a simple response.

    // Simple response logic
    // let response = "Thanks for your message! This is a demo response.";

    const response = await fetch("http://localhost:5678/webhook/291a9aff-7226-4cd1-a3ba-d6ffa5e5a3e6", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatInput: message }),
    }).then((res) => res.json());
    console.log("🚀 ~ POST ~ response:", response);

    

    return NextResponse.json({ message: response?.output }, { status: 200 });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
