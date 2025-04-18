import { EditorContent } from "./Block"
export type Blog = {
  _id: string
  bannerUrl: string
  title: string
  description: string
  category: string
  content: EditorContent
}