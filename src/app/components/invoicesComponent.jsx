"use client"

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
const BackBaseUrl = process.env.NEXT_PUBLIC_BACK_BASE_URL
const FrontBaseUrl = process.env.NEXT_PUBLIC_FRONT_BASE_URL

export function InvoicesComponent() {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [username, setUsername] = useState(null)


  useEffect(() => {
    const fetchName = async () => {
      try {
        const url ='api/get-name'
        const response = await fetch(url, {
          method: 'GET'
        })
        const data = await response.json()
        setUsername(data.name)
      } catch (error) {
        console.error('Error fetching name:', error)
      }
    }
  
    fetchName()
  }, [])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const url = BackBaseUrl + '/db/invoices'
        const response = await fetch(url, {
          method: 'GET'
        })
        const data = await response.json()
        setInvoices(data)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }

    fetchInvoices()
  }, [])

  const handleInvoiceClick = async invoiceId => {
    try {
      const url = BackBaseUrl + `/db/invoice/${invoiceId}`
      const response = await fetch(url, {
        method: 'GET'
      })
      if (response.ok) {
        const invoice = await response.json()
        setSelectedInvoice(invoice)
        setComments(invoice.comments || [])
        setNewComment('')
        setIsSending(false)
      } else {
        console.error('Failed to fetch invoice details')
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error)
    }
  }

  const handleDownloadOriginal = async () => {
    if (!selectedInvoice) return

    try {
      const url = BackBaseUrl + `/ocr/download/original/${selectedInvoice.fileName}`
      const response = await fetch(url, {
        method: 'GET'
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', selectedInvoice.fileName)
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

  const handleDownloadSummary = async () => {
    if (!selectedInvoice) return

    try {
      const url = BackBaseUrl + `/ocr/download/summarized/${selectedInvoice.fileName}`
      const response = await fetch(url, {
        method: 'GET',
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${selectedInvoice.fileName.replace(/\.[^/.]+$/, '')}-summarized.pdf`)
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

  const handleAddComment = async () => {
    if (!newComment || !selectedInvoice) return

    setIsSending(true)

    const newCommentData = {
      name: username,
      comment: newComment
    }

    try {
      const url = BackBaseUrl + `/db/add-comment/${selectedInvoice.id}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommentData)
      })

      if (response.ok) {
        const { comments } = await response.json()
        setComments(comments)
        setNewComment('')
      } else {
        console.error('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSending(false)
    }
  }

  const getInitials = name => {
    const nameParts = name.split(' ')
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
    }
    return nameParts[0][0]
  }

  return (
    <div className="mt-16 mb-10 grid min-h-screen w-full grid-cols-[1fr_2fr] bg-muted/40">
      <div className="flex flex-col border-r bg-background">
        <div className="flex h-14 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">Invoices</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow />
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleInvoiceClick(invoice.id)}
                >
                  <TableCell>{invoice.fileName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex h-14 items-center justify-between border-b bg-background px-6">
          <h2 className="text-lg font-semibold">Invoice Details</h2>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="px-4 py-2"
              onClick={handleDownloadOriginal}
            >
              <DownloadIcon className="h-4 w-4 mr-3" />
              Invoice
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="px-4 py-2"
              onClick={handleDownloadSummary}
            >
              <DownloadIcon className="h-4 w-4 mr-3" />
              Summarized Invoice
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {selectedInvoice ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div 
                  className="text-lg font-semibold"
                  style={{ lineHeight: '1.1', fontSize: '15px' }}
                  dangerouslySetInnerHTML={{ __html: selectedInvoice.summary.replace(/\n/g, '<br />') }}
                />
              </div>
              <Separator className="my-6" />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Comments</div>
                  <div className="grid gap-4">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                          <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="font-medium">{comment.name}</div>
                          <div>{comment.comment}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Add Comment</div>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                      <AvatarFallback>{getInitials(username)}</AvatarFallback>
                    </Avatar>
                    <Textarea
                      placeholder="Type your comment here..."
                      className="flex-1"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                  <div className="flex items-center mt-4 justify-between">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="ml-11 px-4 py-2" 
                      onClick={handleAddComment} 
                      disabled={isSending}
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Select an invoice to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
