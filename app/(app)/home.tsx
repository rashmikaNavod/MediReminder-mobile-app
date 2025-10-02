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

import {
	registerForPushNotificationsAsync,
	cancelAllAppReminders,
} from "@/lib/notification";
import { Medication } from "@/types/Medication";

const { width } = Dimensions.get("window");

const getTodaysDateString = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

const todayString = getTodaysDateString();

const HomeScreen = () => {
	const { user } = useUser();
	const { signOut, userId } = useAuth();
	const [showNotifications, setShowNotifications] = useState(false);
	const [isMenuVisible, setMenuVisible] = useState(false);

	const { fetchMedication, medications } = useMedicationStore();
	const [todaysMedications, setTodaysMedications] = useState<Medication[]>([]);

	useEffect(() => {
		if (userId) {
			fetchMedication(userId);
		}
	}, [userId]);

	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const todayMed = medications.filter((med) => {
			const startDate = new Date(med.startDate);
			startDate.setHours(0, 0, 0, 0);

			const durationInfo = DURATIONS.find((d) => d.label === med.duration);
			if (durationInfo?.value === undefined) return false;

			if (durationInfo.value === -1) {
				return startDate <= today;
			}

			const endDate = new Date(
				startDate.getTime() + (durationInfo.value - 1) * 24 * 60 * 60 * 1000
			);
			endDate.setHours(23, 59, 59, 999);

			if (today >= startDate && today <= endDate) {
				return true;
			}

			return false;
		});

		setTodaysMedications(todayMed);
	}, [medications]);

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

	const totalDoses = todaysMedications.reduce(
		(sum, med) => sum + med.times.length,
		0
	);

	const completedDoses = todaysMedications.reduce((sum, med) => {
		const takenToday = med.takenHistory?.[todayString] || [];
		return sum + takenToday.length;
	}, 0);

	const progress = totalDoses > 0 ? completedDoses / totalDoses : 0;

	const missedMedication = todaysMedications.reduce((acc, med) => {
		const now = new Date();
		const takenToday = med.takenHistory?.[todayString] || [];

		const missedTimes = med.times.filter((time) => {
			const [hours, minutes] = time.split(":").map(Number);
			const doseTime = new Date();
			doseTime.setHours(hours, minutes, 0, 0);
			return now > doseTime && !takenToday.includes(time);
		});

		if (missedTimes.length > 0) {
			acc.push({
				...med,
				times: missedTimes,
			});
		}

		return acc;
	}, [] as Medication[]);

	const notificationCount = missedMedication.reduce(
		(sum, med) => sum + med.times.length,
		0
	);

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
						<View className="flex-row gap-2 items-center">
							<TouchableOpacity
								className="relative p-2 bg-[rgba(255,255,255,0.3)] w-11 h-11 rounded-full items-center justify-center"
								onPress={() => {
									setShowNotifications(true);
								}}
							>
								<Ionicons
									name="notifications-outline"
									size={24}
									color="white"
								/>
								{missedMedication.length > 0 && (
									<View className="absolute -top-1 -right-1 bg-red-600 rounded-full h-5 min-w-5 px-1 items-center justify-center">
										<Text
											numberOfLines={1}
											className="text-[11px] font-Outfit-SemiBold text-white leading-[13px] text-center"
										>
											{notificationCount}
										</Text>
									</View>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								className="w-11 h-11 rounded-full overflow-hidden"
								onPress={toggleMenu}
							>
								{user?.imageUrl && (
									<Image
										source={{ uri: user.imageUrl }}
										className="w-full h-full"
									/>
								)}
							</TouchableOpacity>
						</View>
					</View>

					<CircularProgress
						progress={progress}
						totalDoses={totalDoses}
						completedDoses={completedDoses}
						width={width}
					/>
				</View>

				<QuickAction />

				<TodaySchedule medications={todaysMedications} />

				<NotificationModal
					visible={showNotifications}
					onClose={() => setShowNotifications(false)}
					medi={missedMedication}
				/>
			</ScrollView>

			<UserMenuModal
				visible={isMenuVisible}
				onClose={toggleMenu}
				user={user}
				onSignOut={handleSignOut}
				clearAllReminder={cancelAllAppReminders}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default HomeScreen;
