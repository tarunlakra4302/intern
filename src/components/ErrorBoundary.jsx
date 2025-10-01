import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
              <h2 className="card-title text-error justify-center">Something went wrong!</h2>
              <p className="text-base-content/70 mb-4">
                This page encountered an error and couldn't load properly.
              </p>

              {this.state.error && (
                <div className="collapse collapse-arrow bg-base-200 mb-4">
                  <input type="checkbox" />
                  <div className="collapse-title text-sm font-medium">
                    View Error Details
                  </div>
                  <div className="collapse-content text-xs">
                    <div className="bg-base-300 p-3 rounded text-left">
                      <p className="font-semibold text-error">Error:</p>
                      <p className="mb-2">{this.state.error.toString()}</p>
                      {this.state.errorInfo && (
                        <>
                          <p className="font-semibold text-error">Stack Trace:</p>
                          <pre className="whitespace-pre-wrap text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="card-actions justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-outline"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;