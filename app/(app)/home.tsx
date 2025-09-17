import CircularProgress from "@/components/CircularProgress";
import QuickAction from "@/components/QuickAction";
import TodaySchedule from "@/components/TodaySchedule";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
	View,
	Text,
	Button,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	const { user } = useUser();
	const { signOut } = useAuth();

	return (
		<View className="flex-1 bg-[#f8f9fa] relative">
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="pt-14 pb-6 rounded-b-3xl bg-[#1976D2] items-center px-5 mb-5">
					<View className="flex flex-row items-center mb-2 w-full justify-between">
						<View>
							<Text className="font-Outfit-SemiBold text-white text-[18px]">
								Daily Progress
							</Text>
						</View>
						<TouchableOpacity className="relative p-2 bg-[rgba(255,255,255,0.3)] rounded-full ml-3">
							<Ionicons name="notifications-outline" size={24} color="white" />
							<View className="absolute -top-1 -right-1 bg-red-600 rounded-full h-5 min-w-5 px-1 items-center justify-center">
								<Text
									numberOfLines={1}
									className="text-[11px] font-Outfit-SemiBold text-white leading-[13px] text-center"
								>
									14
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					<CircularProgress
						progress={0.86}
						totalDoses={5}
						completedDoses={4}
						width={width}
					/>
				</View>

				<QuickAction />

				<TodaySchedule />
			</ScrollView>

			<TouchableOpacity
				className="absolute bottom-8 right-6"
				onPress={() => {
					console.log("hi rashmika");
				}}
			>
				{user?.imageUrl && (
					<Image
						source={{ uri: user.imageUrl }}
						className="w-20 aspect-square rounded-full"
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default HomeScreen;

// <View
// 	style={{
// 		flex: 1,
// 		justifyContent: "center",
// 		alignItems: "center",
// 		padding: 20,
// 	}}
// >
// 	{user?.imageUrl && (
// 		<Image
// 			source={{ uri: user.imageUrl }}
// 			style={{
// 				width: 100,
// 				height: 100,
// 				borderRadius: 50,
// 				marginBottom: 20,
// 			}}
// 		/>
// 	)}
// 	<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
// 		Welcome, {user?.firstName}!
// 	</Text>
// 	<Text style={{ fontSize: 16, color: "gray", marginBottom: 40 }}>
// 		{user?.primaryEmailAddress?.emailAddress}
// 	</Text>
// 	<Button title="Sign Out" onPress={() => signOut()} color="#f44336" />
// </View>
