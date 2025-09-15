import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRef } from "react";
import Svg, { Circle } from "react-native-svg";

interface CicularProgressProps {
	progress: number;
	totalDoses: number;
	completedDoses: number;
	width: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
	progress,
	totalDoses,
	completedDoses,
	width,
}: CicularProgressProps) => {
	const animationValue = useRef(new Animated.Value(0)).current;
	const size = width * 0.55;
	const strokeWidth = 15;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	useEffect(() => {
		Animated.timing(animationValue, {
			toValue: progress,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	}, [progress]);

	const strokeDashoffset = animationValue.interpolate({
		inputRange: [0, 1],
		outputRange: [circumference, 0],
	});

	return (
		<View className="items-center justify-center my-3">
			<View className="absolute z-10 items-center justify-center">
				<Text className="font-Outfit-Bold text-white/85 text-3xl">
					{Math.round(progress * 100)}%
				</Text>
				<Text className="text- text-[rgba(255,255,255,0.9)] font-Outfit-Regular">
					{completedDoses} of {totalDoses} doses
				</Text>
			</View>

			<Svg
				width={size}
				height={size}
				style={{ transform: [{ rotate: "-90deg" }] }}
			>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="rgba(255, 255, 255, 0.2)"
					strokeWidth={strokeWidth}
					fill="none"
				/>
				<AnimatedCircle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="white"
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({});

export default CircularProgress;
