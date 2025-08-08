import React, { Suspense, useEffect, useRef, useState } from 'react';

type AnyProps = Record<string, unknown>;

type LazyProps<P extends AnyProps> = {
  load: () => Promise<{ default: React.ComponentType<P> }>;
  fallback?: React.ReactNode;
  visible?: boolean;
} & P;

export default function Lazy<P extends AnyProps>({
  load,
  fallback = null,
  visible = true,
  ...rest
}: LazyProps<P>) {
  const [hasBeenVisible, setHasBeenVisible] = useState<boolean>(visible);
  const LazyComponentRef = useRef<React.LazyExoticComponent<
    React.ComponentType<P>
  > | null>(null);

  useEffect(() => {
    if (visible) setHasBeenVisible(true);
  }, [visible]);

  if (!hasBeenVisible) {
    return <>{fallback}</>;
  }

  if (!LazyComponentRef.current) {
    LazyComponentRef.current = React.lazy(load);
  }

  const Component = LazyComponentRef.current;
  return (
    <Suspense fallback={fallback}>
      {Component ? <Component {...(rest as unknown as P)} /> : null}
    </Suspense>
  );
}
