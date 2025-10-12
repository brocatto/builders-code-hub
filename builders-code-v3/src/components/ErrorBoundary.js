import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="glassmorphism rounded-xl p-8 text-center m-4">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            ⚠️ Erro no componente: {this.props.componentName || 'Desconhecido'}
          </h2>
          <p className="text-secondary-text mb-4">
            {this.state.error && this.state.error.toString()}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="bg-primary text-dark px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Tentar Novamente
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left text-xs text-gray-400">
              <summary>Detalhes do erro (desenvolvimento)</summary>
              <pre className="mt-2 p-2 bg-dark-card rounded text-red-300">
                {this.state.error && this.state.error.stack}
              </pre>
              <pre className="mt-2 p-2 bg-dark-card rounded text-orange-300">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;