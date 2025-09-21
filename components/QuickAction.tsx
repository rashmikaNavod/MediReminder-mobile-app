import {
	View,
	Text,
	Button,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const QUICK_ACTIONS = [
	{
		icon: "add-circle-outline" as const,
		label: "Add Medication",
		route: "/add" as const,
		color: "#4CAF50",
		gradient: ["#4CAF50", "#2E7D32"] as [string, string],
	},
	{
		icon: "calendar-outline" as const,
		label: "Calendar View",
		route: "/" as const,
		color: "#1976D2",
		gradient: ["#2196F3", "#1976D2"] as [string, string],
	},
	{
		icon: "time-outline" as const,
		label: "Delete Medication",
		route: "/delete" as const,
		color: "#E91E63",
		gradient: ["#E91E63", "#C2185B"] as [string, string],
	},
	{
		icon: "medical-outline" as const,
		label: "Update Medication",
		route: "/update" as const,
		color: "#FF5722",
		gradient: ["#FF5722", "#E64A19"] as [string, string],
	},
];

const QuickAction = () => {
	return (
		<View className="px-5 mb-6">
			<Text className="font-Outfit-Bold text-2xl text-[#212121]">
				Quick Actions
			</Text>
			<View className="mt-4 gap-5">
				{QUICK_ACTIONS.map((action) => (
					<Link href={action.route} key={action.label} asChild>
						<TouchableOpacity>
							<View
								className="p-4 rounded-xl flex-row w-ful items-center gap-4"
								style={[style.cardShadow, { backgroundColor: action.color }]}
							>
								<View className="w-10 h-10 bg-[rgba(255,255,255,0.3)] items-center justify-center rounded-xl">
									<Ionicons name={action.icon} size={25} color="white" />
								</View>
								<Text className="text-xl font-Outfit-SemiBold text-white">
									{action.label}
								</Text>
								<View className="ml-auto right-0 w-10 h-10 bg-[rgba(255,255,255,0.3)] items-center justify-center rounded-xl">
									<Ionicons
										name="chevron-forward-outline"
										size={24}
										color="white"
									/>
								</View>
							</View>
						</TouchableOpacity>
					</Link>
				))}
			</View>
		</View>
	);
};

const style = StyleSheet.create({
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default QuickAction;
