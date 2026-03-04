import { type ComponentType, type ReactNode, Suspense, use } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

const DEFAULT_FALLBACK = <span>Loading…</span>;

interface ResolvedProps<T> {
  promise: Promise<T>;
  children: (data: T) => ReactNode;
}

function Resolved<T>({ promise, children }: ResolvedProps<T>) {
  const data = use(promise);
  return <>{children(data)}</>;
}

interface AsyncProps<T> {
  promise: Promise<T>;
  children: (data: T) => ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function Async<T>({
  promise,
  children,
  fallback,
  errorFallback,
}: AsyncProps<T>) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback ?? DEFAULT_FALLBACK}>
        <Resolved promise={promise}>{children}</Resolved>
      </Suspense>
    </ErrorBoundary>
  );
}

interface WithAsyncProps<T> {
  promise: Promise<T>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function withAsync<T, P extends object>(
  WrappedComponent: ComponentType<P & { data: T }>,
  fallback?: ReactNode,
  errorFallback?: ReactNode,
) {
  function AsyncWrapper({
    promise,
    ...props
  }: WithAsyncProps<T> & Omit<P, "data">) {
    return (
      <Async
        promise={promise}
        fallback={fallback}
        errorFallback={errorFallback}
      >
        {(data) => <WrappedComponent data={data} {...(props as P)} />}
      </Async>
    );
  }

  AsyncWrapper.displayName = `withAsync(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return AsyncWrapper;
}
