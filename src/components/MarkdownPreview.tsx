'use client'

import dynamic from 'next/dynamic'

import '@uiw/react-markdown-preview/markdown.css'

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then(mod => mod.default),
  { ssr: false }
)

interface MarkdownPreviewProps {
  source: string
  className?: string
}

export default function MarkdownPreviewWrapper({
  source,
  className,
}: MarkdownPreviewProps) {
  return (
    <div data-color-mode="light" className={className}>
      <MarkdownPreview source={source} />
    </div>
  )
}
