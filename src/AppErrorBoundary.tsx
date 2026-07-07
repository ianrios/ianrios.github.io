import { Component } from 'react';
import type React from 'react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    console.error('Uncaught error in app tree:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <a href="/">Back to portfolio</a>
        </div>
      );
    }
    return this.props.children;
  }
}
