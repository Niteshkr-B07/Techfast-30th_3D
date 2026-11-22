import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.fallback) return this.fallback;
      return (
        this.props.fallback || (
          <div className="fixed inset-0 z-0 flex items-center justify-center bg-[#030409]">
            <div className="glass-panel max-w-md p-8 text-center">
              <p className="font-display text-base tracking-[0.2em] text-gold-300">
                AETHERIAL ENGINE OFFLINE
              </p>
              <p className="mt-3 text-xs tracking-wider text-gold-300/70">
                The 3D environment encountered an unexpected display condition. All event schedules, registration, and sections remain fully functional below.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="explore-btn mt-6 px-6 py-2 font-display text-[10px] tracking-[0.25em] text-gold-300"
              >
                RETRY 3D VIEW
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }

  private get fallback(): ReactNode {
    return this.props.fallback;
  }
}
