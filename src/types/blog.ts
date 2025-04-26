import { EditorContent } from './Block'
export type Blog = {
  _id: string
  bannerUrl: string
  title: string
  description: string
  category: string
  content: EditorContent
}

export interface BlogRequestBody {
  title: string
  content: EditorContent
  bannerUrl?: string
  description: string
  status?: string
  tags?: string[]
  category?: string
}

export type ArticleRow = {
  id: string
  title: string
  sectionType: 'Technical' | 'Planning' | 'Opinion' | 'News'
  status: 'Draft' | 'In Process' | 'Done' | 'Archived'
  views: number
  comments: number
  reviewer?: string
}
