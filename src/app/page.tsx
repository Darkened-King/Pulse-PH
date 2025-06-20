"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "system"; content: string }[]
  >([
    {
      role: "system",
      content: `# Welcome to Your Social Media Assistant! 👋

I can help you manage your social media accounts in several ways:

## What I can do:
- Create draft social media posts for you
- Publish social media posts
- Reply to messages on your behalf
- Schedule social media posts for publishing (work in progress)

## Click on the buttons below to easily get started!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "create":
        message = "I'd like to create a new social media post";
        break;
      case "publish":
        message = "I want to publish a post to my social media";
        break;
      case "reply":
        message = "Check my messages and help me reply to them";
        break;
      case "schedule":
        message = "I want to schedule some posts for later";
        break;
      default:
        return;
    }
    setInput(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Set hasInteracted to true when user sends their first message
    setHasInteracted(true);

    // Add user message to the chat
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add response to chat
      setMessages((prev) => [
        ...prev,
        { role: "system", content: data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="text-center">Social Media Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex gap-2 max-w-[80%]">
                    {message.role === "system" && (
                      <>
                        <Avatar className="h-8 w-8">
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                            AI
                          </div>
                        </Avatar>
                        {index === 0 && !hasInteracted && (
                          <div className="absolute mt-[280px] flex gap-2 flex-wrap max-w-[600px]">
                            <Button
                              variant="outline"
                              onClick={() => handleQuickAction("create")}
                            >
                              ✍️ Create Post
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleQuickAction("publish")}
                            >
                              📢 Publish Post
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleQuickAction("reply")}
                            >
                              💬 Reply to Messages
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleQuickAction("schedule")}
                            >
                              🗓️ Schedule Posts
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "system" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-xl font-bold mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-semibold mb-2 mt-3">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-semibold mb-2 mt-3">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="text-sm font-semibold mb-2 mt-3">
                                {children}
                              </h4>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 space-y-1 mb-2">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 space-y-1 mb-2">
                                {children}
                              </ol>
                            ),
                            img: ({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt}
                                className="rounded-md max-w-full h-auto my-2"
                              />
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-primary pl-4 italic my-2">
                                {children}
                              </blockquote>
                            ),
                            code: ({ children }) => (
                              <code className="bg-muted rounded px-1 py-0.5 text-sm">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-2">
                                {children}
                              </pre>
                            ),
                            hr: () => <hr className="my-4 border-muted" />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <div className="bg-zinc-800 text-zinc-50 rounded-full h-full w-full flex items-center justify-center text-xs">
                          U
                        </div>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
                        AI
                      </div>
                    </Avatar>
                    <div className="rounded-lg p-3 text-sm bg-muted">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 min-h-[50px] text-base px-4"
              disabled={isLoading}
            />
            <Button type="submit" size="lg" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
