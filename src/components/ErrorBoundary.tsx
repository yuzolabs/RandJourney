import React from 'react'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    void error
    void info
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={styles.container} role="alert">
          <div className={styles.content}>
            <span className={styles.icon} aria-hidden="true">⚠️</span>
            <h2 className={styles.title}>予期せぬエラーが発生しました</h2>
            <p className={styles.message}>ページを再読み込みしてください。</p>
            <button
              type="button"
              className={styles.reloadButton}
              onClick={this.handleReload}
            >
              再読み込み
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
