import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}
interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the real error so we can see what's breaking
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error.message, error.stack, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6 text-sm text-clay-700 font-mono">
            [Error] {this.state.error?.message}
          </div>
        )
      )
    }
    return this.props.children
  }
}
