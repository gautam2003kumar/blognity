'use client'

import type { EditorContent } from '@/types/Block'
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import EditorJS, { BlockToolConstructable } from '@editorjs/editorjs'

export type EditorRef = {
  save: () => Promise<EditorContent>
}

const Editor = forwardRef<EditorRef, { data?: EditorContent }>(({ data }, ref) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const editorInstance = useRef<EditorJS | null>(null)

  const initializeEditor = async () => {
    if (!editorInstance.current) {
      const Editorjs = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const List = (await import('@editorjs/list')).default
      const Table = (await import('@editorjs/table')).default
      const CodeTool = (await import('@editorjs/code')).default
      const Quote = (await import('@editorjs/quote')).default
      const Delimiter = (await import('@editorjs/delimiter')).default

      editorInstance.current = new Editorjs({
        holder: 'editorjs',
        tools: {
          header: {
            class: Header as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              placeholder: 'Heading',
              levels: [2, 3, 4],
              defaultLevel: 3,
            },
          },
          list: List,
          table: Table,
          code: CodeTool,
          quote: Quote,
          delimiter: Delimiter,
        },
        data: data || {
          time: new Date().getTime(),
          blocks: [],
        },
        onReady: () => {
          console.log('Editor.js is ready')
        },
      })
    }
  }

  useImperativeHandle(ref, () => ({
    save: async (): Promise<EditorContent> => {
      if (editorInstance.current) {
        try {
          const outputData: EditorContent = await editorInstance.current.save()
          console.log('Data saved:', outputData)
          return outputData
        } catch (error) {
          console.error('Saving failed:', error)
          throw error
        }
      }
      throw new Error('Editor is not initialized')
    },
  }))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()
    }

    if (isMounted) {
      init()
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy()
        editorInstance.current = null
      }
    }
  }, [isMounted])

  return (
    <div className="prose max-w-full mx-auto">
      <div id="editorjs"></div>
    </div>
  )
})

Editor.displayName = 'Editor'

export default Editor
