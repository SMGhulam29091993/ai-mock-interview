"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

interface AgentProps {
  username: string;
  userId: string;
  type: "generate" | "take";
}

enum CallState {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({ username, userId, type }: AgentProps) => {
  const [callState, setCallState] = useState<CallState>(CallState.INACTIVE);
  const isSpeaking = true;

  const messages = [
    "What is your name?",
    "My name is Vapi. I am an AI-powered virtual interviewer designed to help you practice and improve your interview skills.",
  ];
  const lastMessage = messages[messages.length - 1];
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{username}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callState !== CallState.ACTIVE ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "abosolute animate-ping rounded-full opacity-75",
                callState !== CallState.CONNECTING && "hidden"
              )}
            />
            <span>
              {callState === "INACTIVE" || callState === "FINISHED"
                ? "Call"
                : "...."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
