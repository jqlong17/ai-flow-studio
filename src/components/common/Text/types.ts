export interface TextProps {
  content: string
  fontSize?: number
  align?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold' | 'lighter'
}

export interface TextDisplayProps extends TextProps {
  editable?: boolean
} 