'use client'

import React, { JSX } from 'react'
import type { EditorContent } from '@/types/Block'

type Props = {
  content: EditorContent
}

const HeadingBlock: React.FC<{ data: { text: string; level: number } }> = ({ data }) => {
  const HeadingTag = `h${data.level}` as keyof JSX.IntrinsicElements
  const classMap: Record<number, string> = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-semibold',
    3: 'text-2xl font-medium',
  }

  const lines = data.text.split('\n')

  return (
    <HeadingTag className={`${classMap[data.level] || 'text-lg font-medium'} leading-snug`}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </HeadingTag>
  )
}

const RENDERERS: Record<string, (block: any, index: number) => React.ReactNode> = {
  header: (block, i) => {
    const level = parseInt(block.data.level['$numberInt'] || block.data.level) // support both wrapped and plain
    return <HeadingBlock key={i} data={{ text: block.data.text, level }} />
  },

  paragraph: (block, i) => (
    <p
      key={i}
      className="leading-relaxed mb-4 text-lg"
      dangerouslySetInnerHTML={{ __html: block.data.text }}
    />
  ),

  list: (block, i) => {
    const Tag = block.data.style === 'ordered' ? 'ol' : 'ul'
    return (
      <Tag key={i} className={Tag === 'ol' ? 'list-decimal list-inside' : 'list-disc list-inside'}>
        {block.data.items.map((item: any, j: number) => {
          const html = typeof item === 'string' ? item : item.content
          return <li className="mb-2 text-lg" key={j} dangerouslySetInnerHTML={{ __html: html }} />
        })}
      </Tag>
    )
  },

  quote: (block, i) => (
    <blockquote key={i} className="border-l-4 pl-4 italic">
      {block.data.text}
      {block.data.caption && <footer className="mt-1 text-sm">— {block.data.caption}</footer>}
    </blockquote>
  ),

  code: (block, i) => (
    <pre key={i} className="bg-muted p-3 rounded-md overflow-x-auto">
      <code>{block.data.code}</code>
    </pre>
  ),

  delimiter: (_, i) => <hr key={i} className="my-6 border-t" />,

  table: (block, i) => (
    <table key={i} className="table-auto border w-full">
      <tbody>
        {block.data.content.map((row: string[], ri: number) => (
          <tr key={ri}>
            {row.map((cell: string, ci: number) => (
              <td
                key={ci}
                className="border px-4 py-2"
                dangerouslySetInnerHTML={{ __html: cell }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

const Renderer = ({ content }: Props) => {
  if (!content?.blocks?.length) {
    return <p className="text-muted-foreground">No content available</p>
  }

  return (
    <div className="prose max-w-none dark:prose-invert">
      {content.blocks.map((block, index) =>
        RENDERERS[block.type] ? (
          <div key={block.id || index} className="mb-6 last:mb-0">
            {RENDERERS[block.type](block, index)}
          </div>
        ) : null
      )}
    </div>
  )
}

export default Renderer
