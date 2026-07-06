
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './ContactSection';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="p-8 text-center max-w-lg border-red-900/50 bg-red-900/10 rounded-sm">
                <h1 className="text-2xl font-bold text-red-400 mb-4 font-mono uppercase tracking-widest">SYSTEM_ERROR</h1>
                <p className="text-red-800/80 mb-6 font-mono text-xs uppercase">
                    CRITICAL FAILURE DETECTED IN RENDER PIPELINE.
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 font-bold font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all"
                >
                    {'>> REBOOT_SYSTEM'}
                </button>
            </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
