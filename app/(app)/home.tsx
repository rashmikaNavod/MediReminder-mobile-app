import CircularProgress from "@/components/CircularProgress";
import NotificationModal from "@/components/NotificationModal";
import QuickAction from "@/components/QuickAction";
import TodaySchedule from "@/components/TodaySchedule";
import UserMenuModal from "@/components/UserMenuModal";
import { useMedicationStore } from "@/store/useMedicationStore";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Modal,
	StyleSheet,
	Button,
	Alert,
} from "react-native";

const DURATIONS = [
	{ id: "1", label: "7 days", value: 7 },
	{ id: "2", label: "14 days", value: 14 },
	{ id: "3", label: "30 days", value: 30 },
	{ id: "4", label: "90 days", value: 90 },
	{ id: "5", label: "Ongoing", value: -1 },
];

import { registerForPushNotificationsAsync } from "@/lib/notification";
import { Medication } from "@/types/Medication";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	const { user } = useUser();
	const { signOut, userId } = useAuth();
	const [showNotifications, setShowNotifications] = useState(false);
	const [isMenuVisible, setMenuVisible] = useState(false);

	const { fetchMedication, medications } = useMedicationStore();
	const [todaysMedications, setTodaysMedications] = useState<Medication[]>([]);
	const [completedDoses, setCompletedDoses] = useState(0);



	const handleHomePage = () => {
		const today = new Date();
		const todayMed = medications.filter((med) => {
			const startDate = new Date(med.startDate);
			const durationInfo = DURATIONS.find((d) => d.label === med.duration);
			if(durationInfo?.value === undefined) return false;
			if (
				durationInfo.value === -1 ||
				(today >= startDate && today <= new Date(startDate.getTime() + durationInfo.value * 24 * 60 * 60 * 1000))
			) {
				return true;
			}
			return false;
		});

		setTodaysMedications(todayMed);
		// setCompletedDoses(todayMed.filter((m) => m.taken)?.length || 0);
	};

	useEffect(() => {
		if (userId) {
			fetchMedication(userId).then(() => {
				handleHomePage();
			});
		}
	}, [userId, medications]);

	


	const toggleMenu = () => {
		setMenuVisible(!isMenuVisible);
	};
	const handleSignOut = () => {
		toggleMenu();
		signOut();
	};

	useEffect(() => {
		registerForPushNotificationsAsync();
	}, []);

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
									{todaysMedications.length}
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					<CircularProgress
						progress={
							0.7
						}
						totalDoses={todaysMedications.length}
						completedDoses={3}
						width={width}
					/>
				</View>

				<QuickAction />

				<TodaySchedule medications={todaysMedications}/>

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
