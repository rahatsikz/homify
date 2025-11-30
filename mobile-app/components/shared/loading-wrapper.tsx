import { ViewProps } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoadingWrapper({
  children,
  isLoading,
  className,
  withSafeArea = true,
  ...props
}: { isLoading: boolean; children?: React.ReactNode; withSafeArea?: boolean } & ViewProps) {
  if (isLoading) {
    const SkeletonComponent = (
      <Skeleton {...props} className={cn('h-40 w-full self-start rounded-xl', className)} />
    );

    if (withSafeArea) {
      return <SafeAreaView className="bg-background flex-1">{SkeletonComponent}</SafeAreaView>;
    }

    return SkeletonComponent;
  }

  return <>{children}</>;
}
