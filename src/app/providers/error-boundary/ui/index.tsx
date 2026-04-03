import { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { PageError } from 'widgets/page-error';



interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}


export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.log('error: ', error, 'errorInfo: ', errorInfo);
  }

  render() {
    const
      { children } = this.props,
      { hasError } = this.state;

    if (hasError) {
      return (
        <Suspense fallback=''>
          <PageError />
        </Suspense>
      )
    }

    return children;
  }
}

// export default withTranslation()(ErrorBoundary);
