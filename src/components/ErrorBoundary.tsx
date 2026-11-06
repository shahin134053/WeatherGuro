import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    try {
      localStorage.setItem('weatherglobe_onboarded', 'true');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] p-6 m-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {this.props.fallbackTitle || 'সাময়িক ত্রুটি হয়েছে (Something went wrong)'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              অ্যাপের ডেটা লোড করার সময় সমস্যা হয়েছে। অনুগ্রহ করে নিচের বাটনে চাপ দিয়ে পুনরায় চেষ্টা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>পুনরায় চেষ্টা করুন</span>
            </button>
            <button
              onClick={this.handleGoHome}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              title="Home"
            >
              <Home className="w-4 h-4" />
              <span>হোম</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
