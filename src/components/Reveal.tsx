import { useReveal } from '../hooks/useReveal'

interface Props {
  children: React.ReactNode
  type?: 'up' | 'left' | 'scale'
  delay?: number
  className?: string
}

export default function Reveal({ children, type = 'up', delay, className = '' }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const revealType = type === 'up' ? '' : type

  return (
    <div
      ref={ref}
      data-reveal={revealType || true}
      {...(delay ? { 'data-reveal-delay': String(delay) } : {})}
      className={className}
    >
      {children}
    </div>
  )
}
