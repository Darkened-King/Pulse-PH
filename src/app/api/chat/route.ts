import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // In a real application, you would send this message to an AI service
    // or your backend for processing. For now, we'll just echo it back
    // with a simple response.

    // Simple response logic
    // let response = "Thanks for your message! This is a demo response.";

    const response = await fetch(process.env.CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatInput: message }),
    }).then((res) => res.json());
    console.log("🚀 ~ POST ~ response:", response);

    // if (
    //   message.toLowerCase().includes("hello") ||
    //   message.toLowerCase().includes("hi")
    // ) {
    //   response = "Hello there! How can I help you today?";
    // } else if (message.toLowerCase().includes("help")) {
    //   response = "I'm here to help! What do you need assistance with?";
    // } else if (
    //   message.toLowerCase().includes("feature") ||
    //   message.toLowerCase().includes("capabilities")
    // ) {
    //   response =
    //     "This chat app demonstrates a basic social media chat interface using Next.js and shadcn/ui components. In a real application, it would connect to an AI service or backend API.";
    // }

    // Simulate a delay to make the chat feel more natural
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ message: response?.output }, { status: 200 });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
