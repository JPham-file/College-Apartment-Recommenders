import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import classNames from 'classnames';
import { addSkeleton } from '@/src/lib/skeleton';

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
  const r = radius // radius of the circle
  var rx = r,
    ry = r,
    xAxisRotation = 0,
    largeArcFlag = 1,
    sweepFlag = 1,
    x = r + r*Math.sin(a),
    y = r - r*Math.cos(a)
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

  return (
    <View className={`flex flex-col w-24 justify-center items-center mx-2 ${className}`}>
      <Svg height="100%" width="96" viewBox="0 0 96 96" className="absolute left-0 top-0">
        <Circle
          cx="48"
          cy="48"
          r="48"
          fill={colorClasses.circle.secondary}
        />
        <Path d={`M 48 48 L 48 0 ${createArc(percentage, 48)}`} fill={colorClasses.circle.primary} />
        <Circle
          cx="48"
          cy="48"
          r="37"
          fill={fill}
          strokeWidth={"6"}
          strokeOpacity={100}
          stroke={fill}
        />
      </Svg>
      <Text className={percentageClass}>{percentage}%</Text>
    </View>
  );
};

export default MatchPercentageBar;