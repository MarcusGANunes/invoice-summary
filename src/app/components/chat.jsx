"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
const BackBaseUrl = process.env.NEXT_PUBLIC_BACK_BASE_URL

export function Chat({ summary }) {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePromptChange = e => {
    setPrompt(e.target.value)
  }

  const handleQuery = async () => {
    setIsLoading(true)
    const llmResponse = await queryLLM(summary, prompt)
    setResponse(llmResponse)
    setIsLoading(false)
  }

  const queryLLM = async (baseText, userInput) => {
    try {
      const url = BackBaseUrl + `/openai/generate-prompt`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ baseText, userInput })
      })
      if (!response.ok) {
        throw new Error('Failed to generate prompt')
      }
      const data = await response.json()
      return data.prompt
    } catch (error) {
      console.error('Error querying LLM:', error)
      throw error
    }
  }

  return (
    <div className="mt-5 mb-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="llm-prompt"
            name="llm-prompt"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter your question here..."
            rows={4}
            className="mb-4"
          />
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleQuery}
              disabled={isLoading || !prompt.trim()}
              className="w-40"
            >
              {isLoading ? "Loading..." : "Ask GPT"}
            </Button>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-bold mb-2">Response</h4>
            <div className="text-card-foreground">
              {response ? (
                <p>{response}</p>
              ) : (
                <p>No response yet. Please ask a question.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
