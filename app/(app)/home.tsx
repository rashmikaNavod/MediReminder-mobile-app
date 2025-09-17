import CircularProgress from "@/components/CircularProgress";
import QuickAction from "@/components/QuickAction";
import TodaySchedule from "@/components/TodaySchedule";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Modal,
	StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	const { user } = useUser();
	const { signOut } = useAuth();
	const [showNotifications, setShowNotifications] = useState(false);

	const [isMenuVisible, setMenuVisible] = useState(false);
	const toggleMenu = () => {
		setMenuVisible(!isMenuVisible);
	};
	const handleSignOut = () => {
		toggleMenu();
		signOut();
	};

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
						<TouchableOpacity
							className="relative p-2 bg-[rgba(255,255,255,0.3)] rounded-full ml-3"
							onPress={() => {
								setShowNotifications(true);
							}}
						>
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

				<Modal
					visible={showNotifications}
					transparent={true}
					animationType="slide"
				>
					<View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
						<View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
							<View className="flex-row justify-between items-center mb-5">
								<Text className="font-Outfit-Bold text-[#333] text-[20px]">
									Notifications
								</Text>
								<TouchableOpacity
									className="p-[5px]"
									onPress={() => setShowNotifications(false)}
								>
									<Ionicons name="close" size={25} color="#333" />
								</TouchableOpacity>
							</View>
						</View>
					</View>
					{[].map((medication) => (
						<View className="flex-row p-4 rounded-xl bg-[#f5f5f5] mb-3">
							<View className="w-10 h-10 rounded-3xl bg-[#e8f5e9] justify-center items-center mr-4">
								<Ionicons name="medical" size={24} />
							</View>
							<View className="flex-1">
								<Text className="font-Outfit-SemiBold text-base text-[#333] mb-1">
									MEDI name
								</Text>
								<Text className="text-[14px] text-[#666] mb-4">
									MEDI dosage
								</Text>
								<Text className="text-[12px] text-[#999] ">MEDI time</Text>
							</View>
						</View>
					))}
				</Modal>
			</ScrollView>

			<TouchableOpacity
				className="absolute bottom-8 right-6 z-50"
				onPress={toggleMenu}
			>
				{user?.imageUrl && (
					<Image
						source={{ uri: user.imageUrl }}
						className="w-20 aspect-square rounded-full"
					/>
				)}
			</TouchableOpacity>
			<Modal
				visible={isMenuVisible}
				transparent={true}
				animationType="slide"
				style={styles.modal}
			>
				<View style={styles.menuContent}>
					{/* User details section */}
					<View className="items-center mb-6">
						{user?.imageUrl && (
							<Image
								source={{ uri: user.imageUrl }}
								className="w-20 h-20 rounded-full mb-3"
							/>
						)}
						<Text className="text-lg font-Outfit-Bold text-gray-800">
							{user?.fullName}
						</Text>
						<Text className="text-sm font-Outfit-Regular text-gray-500">
							{user?.primaryEmailAddress?.emailAddress}
						</Text>
					</View>

					{/* Menu Options */}
					<TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
						<Ionicons name="person-circle-outline" size={24} color="#3F51B5" />
						<Text className="ml-4 text-base font-Outfit-Medium text-gray-700">
							Manage Account
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSignOut}
						className="flex-row items-center p-4"
					>
						<Ionicons name="log-out-outline" size={24} color="#f44336" />
						<Text className="ml-4 text-base font-Outfit-Medium text-red-600">
							Sign Out
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end", // Modal එක පහළින්ම තියනවා
		margin: 0,
	},
	menuContent: {
		backgroundColor: "white",
		paddingVertical: 20,
		paddingHorizontal: 25,
		borderTopRightRadius: 20, // උඩින් corners ටික round කරනවා
		borderTopLeftRadius: 20,
		borderColor: "rgba(0, 0, 0, 0.1)",
	},
});

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
