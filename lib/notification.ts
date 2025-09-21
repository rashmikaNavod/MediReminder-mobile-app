import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Medication } from "@/types/Medication";

//This array is needed to find the numeric value of the duration
const DURATIONS = [
	{ id: "1", label: "7 days", value: 7 },
	{ id: "2", label: "14 days", value: 14 },
	{ id: "3", label: "30 days", value: 30 },
	{ id: "4", label: "90 days", value: 90 },
	{ id: "5", label: "Ongoing", value: -1 },
];

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		alert("Failed to get permission for notifications!");
		return false;
	}

	console.log("Notification permissions have been granted.");
	return true;
}

export const scheduleMedicationReminder = async (medication: Medication) => {
	if (
		!medication.reminderEnabled ||
		!Array.isArray(medication.times) ||
		medication.times.length === 0
	) {
		return;
	}

	// Clear any previously scheduled notifications for this medication to avoid duplicates.
	if (medication.id) {
		const allScheduled =
			await Notifications.getAllScheduledNotificationsAsync();
		for (const notification of allScheduled) {
			if (notification.identifier.startsWith(`med-reminder-${medication.id}`)) {
				await Notifications.cancelScheduledNotificationAsync(
					notification.identifier
				);
				console.log(`Cancelled existing reminder: ${notification.identifier}`);
			}
		}
	}

	// Find the duration object from the DURATIONS array
	const durationInfo = DURATIONS.find((d) => d.label === medication.duration);
	if (!durationInfo) {
		console.error("Invalid duration label provided.");
		return;
	}

	const startDate = new Date(medication.startDate);

	//Case 1: The duration is "Ongoing"
	if (durationInfo.value === -1) {
		for (const [index, time] of medication.times.entries()) {
			const [hour, minute] = time.split(":").map(Number);

			await Notifications.scheduleNotificationAsync({
				identifier: `med-reminder-${medication.id}-${index}`,
				content: {
					title: "💊 බෙහෙත් වෙලාව!",
					body: `ඔබේ ${medication.name} (${medication.dosage}) ලබා ගැනීමට කාලයයි.`,
					sound: "default",
				},
				trigger: {
					hour: hour,
					minute: minute,
					type: Notifications.SchedulableTriggerInputTypes.DAILY,
				},
			});
		}
		console.log("Successfully scheduled ongoing reminders.");
		return;
	}

	//Case 2: The duration is fixed number of days
	const numberOfDay = durationInfo.value;

	//Calculate the end date
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + numberOfDay);

	//Loop through each day from the start date until the end date
	let dayIndex = 0;
	for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
		for (const [index, time] of medication.times.entries()) {
			const [hour, minute] = time.split(":").map(Number);

			const triggerDate = new Date(d);
			triggerDate.setHours(hour, minute, 0, 0);

			if (triggerDate > new Date()) {
				await Notifications.scheduleNotificationAsync({
					identifier: `med-reminder-${medication.id}-${index}`,
					content: {
						title: "💊 බෙහෙත් වෙලාව!",
						body: `ඔබේ ${medication.name} (${medication.dosage}) ලබා ගැනීමට කාලයයි.`,
						sound: "default",
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DATE,
						date: triggerDate,
					},
				});
			}
		}
		dayIndex++;
	}

	console.log(
		`Successfully scheduled ${dayIndex * medication.times.length} individual reminders.`
	);
};

export const cancelMedicationReminders = async (medicationId: string) => {
	if (!medicationId) return;

	try {
		const allScheduled =
			await Notifications.getAllScheduledNotificationsAsync();
		let cancelledCount = 0;

		for (const notification of allScheduled) {
			if (notification.identifier.startsWith(`med-reminder-${medicationId}`)) {
				await Notifications.cancelScheduledNotificationAsync(
					notification.identifier
				);
				cancelledCount++;
			}
		}
		console.log(
			`Cancelled ${cancelledCount} reminders for medication ID: ${medicationId}`
		);
	} catch (error) {
		console.error("Failed to cancel notifications:", error);
	}
};
