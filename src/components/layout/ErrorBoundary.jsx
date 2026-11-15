import React from 'react';

/** Catches render errors so one broken page never white-screens the whole store. */
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Something went wrong · حدث خطأ غير متوقع</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
          Please reload the page. · يرجى إعادة تحميل الصفحة.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.assign('/')}>
          Home · الرئيسية
        </button>
      </div>
    );
  }
}
