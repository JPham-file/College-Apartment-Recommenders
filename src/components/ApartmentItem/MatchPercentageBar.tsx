import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import classNames from 'classnames';
import { addSkeleton, skeleton } from '@/src/lib/skeleton';

export interface MatchPercentageBarProps {
  percentage: number;
  fill: string;
  className?: string;
  isSkeletonLoading?: boolean | null | undefined;
}

const getMatchColorClass = (matchPercentage : number): { className: string, circle: { secondary: string, primary: string } } => {
  //returns native wind color styling based on % match for each apartment
  if (matchPercentage >= 90) return { className: 'text-green-500', circle: { primary: '#22C55E', secondary: '#86EFAC' } };
  if (matchPercentage >= 80) return { className: 'text-lime-500', circle: { secondary: '#bef264', primary: '#84cc16' } };
  if (matchPercentage >= 70) return { className: 'text-yellow-500', circle: { secondary: '#fde047', primary: '#eab308' } };
  if (matchPercentage >= 60) return { className: 'text-amber-500', circle: { secondary: '#fcd34d', primary: '#f59e0b' } };
  if (matchPercentage >= 50) return { className: 'text-orange-500', circle: { secondary: '#fdba74', primary: '#f97316' } };
  return { className: 'text-red-500', circle: { primary: '#ef4444', secondary: '#fca5a5' } };
};

const createArc = (percentage: number, radius: number) => {
  if (percentage === 100) percentage = 99.999
  const a = percentage*2*Math.PI/100 // angle (in radian) depends on percentage
  const rx = radius;
  const ry = radius;
  const xAxisRotation = 0;
  const x = radius + radius * Math.sin(a);
  const y = radius - radius * Math.cos(a);
  const sweepFlag = 1;
  let largeArcFlag;
  if (percentage <= 50){
    largeArcFlag = 0;
  }else{
    largeArcFlag = 1
  }

  return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`
}

const MatchPercentageBar = (props: MatchPercentageBarProps) => {
  const { percentage, className, fill, isSkeletonLoading } = props;
  const colorClasses = isSkeletonLoading
    ? { className: null, circle: { primary: '#d4d4d4', secondary: '#d4d4d4' } }
    : getMatchColorClass(percentage);
  const percentageClass = addSkeleton(classNames('font-bold text-2xl', colorClasses.className), !!isSkeletonLoading);
  const percentContainerClass = addSkeleton('rounded-full', !!isSkeletonLoading, false);
  const containerClass = classNames('flex flex-col w-24 justify-center items-center mx-2', className);

  return (
    <View className={containerClass}>
      <Svg height="100%" width="96" viewBox="-6 -3 108 108" className="absolute left-0 top-0">
        <Path d={`M 48 0 ${createArc(100, 48)}`} fill="none" stroke={colorClasses.circle.secondary} strokeWidth={12} strokeLinecap="round" />
        <Path d={`M 48 0 ${createArc(percentage, 48)}`} fill="none" stroke={colorClasses.circle.primary} strokeWidth={12} strokeLinecap="round" />
      </Svg>
      <View className={percentContainerClass}>
        <Text className={percentageClass}>{percentage}%</Text>
      </View>
    </View>
  );
};

export default MatchPercentageBar;