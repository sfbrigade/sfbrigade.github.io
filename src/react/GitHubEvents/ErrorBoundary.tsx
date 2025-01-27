import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
	onError?: (error: Error, info: ErrorInfo) => void;
	fallback?: ReactNode;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false
	}

	static getDerivedStateFromError(_: Error)
	{
		return { hasError: true };
	}

	componentDidCatch(
		error: Error,
		errorInfo: React.ErrorInfo)
	{
		this.props.onError?.(error, errorInfo);
	}

	render()
	{
		if (this.state.hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}
