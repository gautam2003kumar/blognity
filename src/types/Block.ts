// /types/Block.ts

export interface ParagraphBlock {
  id?: string
  type: 'paragraph'
  data: {
    text: string
  }
}

export interface HeaderBlock {
  id?: string
  type: 'header'
  data: {
    text: string
    level: number
  }
}

export interface ListBlock {
  id?: string
  type: 'list'
  data: {
    style: 'ordered' | 'unordered'
    items: string[]
  }
}

export interface ImageBlock {
  id?: string
  type: 'image'
  data: {
    file: {
      url: string
    }
    caption: string
    withBorder: boolean
    withBackground: boolean
    stretched: boolean
  }
}

export interface QuoteBlock {
  id?: string
  type: 'quote'
  data: {
    text: string
    caption: string
    alignment: 'left' | 'center'
  }
}

export interface CodeBlock {
  id?: string
  type: 'code'
  data: {
    code: string
  }
}

export interface EmbedBlock {
  id?: string
  type: 'embed'
  data: {
    service: string
    source: string
    embed: string
    width: number
    height: number
    caption: string
  }
}

// Fallback for custom/unknown blocks
export interface CustomBlock {
  id?: string
  type: string
  data: Record<string, any>
}

// Union of all supported block types
export type Block =
  | ParagraphBlock
  | HeaderBlock
  | ListBlock
  | ImageBlock
  | QuoteBlock
  | CodeBlock
  | EmbedBlock
  | CustomBlock

export interface EditorContent {
  time?: number // 👈 make it optional
  blocks: {
    id?: string
    type: string
    data: any
  }[]
  version?: string
}
