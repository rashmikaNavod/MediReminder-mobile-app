import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Medication } from "@/types/Medication";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true
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



export async function scheduleNotificationHandler(title: string, body: string, second: number) {
  console.log(`Scheduling notification: "${title}" in ${second} seconds.`);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: second
		},
  });

}

// export async function registerForPushNotificationsAsync(): Promise<
// 	string | null
// > {
// 	let token: string | null = null;

// 	const { status: existingStatus } = await Notifications.getPermissionsAsync();
// 	let finalStatus = existingStatus;

// 	if (existingStatus !== "granted") {
// 		const { status } = await Notifications.requestPermissionsAsync();
// 		finalStatus = status;
// 	}

// 	if (finalStatus !== "granted") return null;

// 	try {
// 		const response = await Notifications.getExpoPushTokenAsync();
// 		token = response.data;

// 		if (Platform.OS === "android") {
// 			await Notifications.setNotificationChannelAsync("default", {
// 				name: "default",
// 				importance: Notifications.AndroidImportance.MAX,
// 				vibrationPattern: [0, 250, 250, 250],
// 				lightColor: "#1a8e2d",
// 			});
// 		}

// 		return token;
// 	} catch (error) {
// 		console.error("Error getting push token:", error);
// 		return null;
// 	}
// }

// export async function scheduleMedicationReminder(
// 	medication: Medication
// ): Promise<string[]> {
// 	if (!medication.reminderEnabled || !Array.isArray(medication.times)) {
// 		return [];
// 	}

// 	try {
// 		const identifiers: string[] = [];

// 		for (const time of medication.times) {
// 			if (!time) continue;

// 			const [h, m] = time.split(":");
// 			const hours = parseInt(h, 10);
// 			const minutes = parseInt(m, 10);

// 			if (isNaN(hours) || isNaN(minutes)) continue;

// 			const identifier = await Notifications.scheduleNotificationAsync({
// 				content: {
// 					title: "Medication Reminder",
// 					body: `Time to take ${medication.name} (${medication.dosage})`,
// 					data: { medicationId: medication.id },
// 				},
// 				trigger: {
// 					type: "calendar",
// 					hour: hours,
// 					minute: minutes,
// 					repeats: true,
// 				} as Notifications.CalendarTriggerInput,
// 			});

// 			identifiers.push(identifier);
// 		}

// 		return identifiers;
// 	} catch (error) {
// 		console.error("Error scheduling medication reminder:", error);
// 		return [];
// 	}
// }
