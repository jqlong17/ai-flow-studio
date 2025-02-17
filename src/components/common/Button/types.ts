export interface ButtonProps {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  size?: 'large' | 'middle' | 'small'
  loading?: boolean
  disabled?: boolean
  icon?: string
  children?: string
}

export interface IconButtonProps extends Omit<ButtonProps, 'icon'> {
  icon: string
  tooltip?: string
} 