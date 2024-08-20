"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { File } from "lucide-react"
const BackBaseUrl = process.env.NEXT_PUBLIC_BACK_BASE_URL

export function Summary({ summary, setSummary }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (file) {
      const uploadFile = async () => {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
  
        try {
          const url = BackBaseUrl + `/ocr/upload`
          const response = await fetch(url, {
            method: 'POST',
            body: formData
          })
  
          if (response.ok) {
            const data = await response.json()
            setSummary(data.res)
            try {
              const url = BackBaseUrl + `/db/add-invoice`
              const dbResponse = await fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: file.name,
                  summary: data.res
                })
              })
              if (!dbResponse.ok) {
                throw new Error('Failed to add invoice to database')
              }
            } catch (error) {
              console.error('Error adding invoice:', error)
            }
          } else {
            console.error('Failed to upload file')
          }
        } catch (error) {
          console.error('Error uploading file:', error)
        } finally {
          setUploading(false)
        }
      }
      uploadFile()
    }
  }, [file, setSummary])

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleDownload = async () => {
    if (summary && file) {
      try {
      const url = BackBaseUrl + `/ocr/download/summarized/${file.name}`
        const response = await fetch(url, {
          method: 'GET',
        });
  
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
  
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${file.name.replace(/\.[^/.]+$/, '')}-summarized.pdf`)
  
          document.body.appendChild(link)
          link.click()
  
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } else {
          console.error('Failed to download the file')
        }
      } catch (error) {
        console.error('Error downloading file:', error)
      }
    }
  }
  
  return (
    <div className="mt-24 mb-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload your invoice to get a summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center items-center">
            <File className="text-card-foreground mr-2" />
            {file ? (
              <span className="text-sm text-card-foreground">{file.name}</span>
            ) : (
              <span className="text-sm text-muted-foreground">No file selected</span>
            )}
          </div>
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              required
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              onClick={handleUploadClick}
              className="w-40"
              disabled={uploading}
            >
              {uploading ? "Processing..." : "Upload"}
            </Button>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-card-foreground mb-2">Invoice Summary</h3>
            <div className="text-card-foreground">
              {summary ? (
                <p>{summary}</p>
              ) : (
                <p>No summary available yet. Please upload an image.</p>
              )}
            </div>
            {!uploading && summary && (
              <div className="flex justify-center">
                <Button
                  onClick={handleDownload}
                  className="mt-4 w-40"
                >
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
