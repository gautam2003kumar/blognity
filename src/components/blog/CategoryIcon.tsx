import { BookOpen, Code, Camera, Music, Palette, Dumbbell } from 'lucide-react'

interface CategoryIconProps {
  category: string
}

export function CategoryIcon({ category }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case 'coding':
      return <Code className="w-4 h-4" />
    case 'photography':
      return <Camera className="w-4 h-4" />
    case 'music':
      return <Music className="w-4 h-4" />
    case 'art':
      return <Palette className="w-4 h-4" />
    case 'fitness':
      return <Dumbbell className="w-4 h-4" />
    default:
      return <BookOpen className="w-4 h-4" /> // Default icon
  }
}
