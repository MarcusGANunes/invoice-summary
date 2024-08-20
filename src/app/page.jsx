"use client"

import { Chat } from "./components/chat";
import { Navbar } from "./components/navbar";
import { Summary } from "./components/summary";
import { useState } from "react";

export default function Home() {
  const [summary, setSummary] = useState("")

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <Summary summary={summary} setSummary={setSummary} />
      </div>
      <div>
        <Chat summary={summary} />
      </div>
    </>
  );
}
