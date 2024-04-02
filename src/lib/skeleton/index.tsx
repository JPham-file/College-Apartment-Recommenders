import React, { PropsWithChildren, useEffect } from 'react';
import classNames from 'classnames';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface skeletonAnimationProps {
  isLoading: boolean;
}

export const SkeletonAnimated = ({ children, isLoading }: PropsWithChildren<skeletonAnimationProps>) => {
  const duration = 1000;
  const easing = Easing.inOut(Easing.quad);
  const opacity = useSharedValue(0.5);
  const fadeInOut = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(1, { duration, easing }), withTiming(0.5, { duration, easing })), -1);
  }, []);

  if (!isLoading) {
    return children;
  }

  return (
    <Animated.View style={[fadeInOut]}>
      {children}
    </Animated.View>
  );
}

export const skeleton = (isLoading: boolean, isTextPresent: boolean = true) => classNames({ 'bg-neutral-300': isLoading && !isTextPresent, 'text-transparent rounded-full': isLoading && isTextPresent });

export const addSkeleton = (className: string, isLoading: boolean, isTextPresent: boolean = true) => classNames(className, skeleton(isLoading, isTextPresent));