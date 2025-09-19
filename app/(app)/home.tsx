import CircularProgress from "@/components/CircularProgress";
import NotificationModal from "@/components/NotificationModal";
import QuickAction from "@/components/QuickAction";
import TodaySchedule from "@/components/TodaySchedule";
import UserMenuModal from "@/components/UserMenuModal";
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

				<NotificationModal
					visible={showNotifications}
					onClose={() => setShowNotifications(false)}
				/>
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

			<UserMenuModal
				visible={isMenuVisible}
				onClose={toggleMenu}
				user={user}
				onSignOut={handleSignOut}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default HomeScreen;


