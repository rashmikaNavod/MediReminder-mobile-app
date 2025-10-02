import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Platform,
	Switch,
	SafeAreaView,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useMedicationStore } from "@/store/useMedicationStore";
// import { scheduleMedicationReminder } from "@/lib/notification";
import { Medication } from "@/types/Medication";
import { scheduleMedicationReminder } from "@/lib/notification";

const { width } = Dimensions.get("window");

const FREQUENCIES = [
	{
		id: "1",
		label: "Once daily",
		icon: "sunny-outline" as const,
		times: ["09:00"],
	},
	{
		id: "2",
		label: "Twice daily",
		icon: "sync-outline" as const,
		times: ["09:00", "21:00"],
	},
	{
		id: "3",
		label: "Three times daily",
		icon: "time-outline" as const,
		times: ["09:00", "15:00", "21:00"],
	},
	{
		id: "4",
		label: "Four times daily",
		icon: "repeat-outline" as const,
		times: ["09:00", "13:00", "17:00", "21:00"],
	},
	{ id: "5", label: "As needed", icon: "calendar-outline" as const, times: [] },
];

const DURATIONS = [
	{ id: "1", label: "7 days", value: 7 },
	{ id: "2", label: "14 days", value: 14 },
	{ id: "3", label: "30 days", value: 30 },
	{ id: "4", label: "90 days", value: 90 },
	{ id: "5", label: "Ongoing", value: -1 },
];

const add = () => {
	const router = useRouter();
	const { userId } = useAuth();
	const { loading, addMedication } = useMedicationStore();

	useEffect(() => {
		console.log(userId);
	}, [userId]);

	const [form, setForm] = useState({
		name: "",
		dosage: "",
		frequency: "",
		duration: "",
		startDate: new Date(),
		times: ["07:00"],
		notes: "",
		reminderEnabled: true,
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedFrequency, setSelectedFrequency] = useState("");
	const [selectedDuration, setSelectedDuration] = useState("");
	const [timePickerIndex, setTimePickerIndex] = useState(0);

	const renderFrequencyOptions = () => {
		return (
			<View style={style.optionsGrid}>
				{FREQUENCIES.map((freq) => (
					<TouchableOpacity
						key={freq.id}
						style={[
							style.optionCard,
							selectedFrequency === freq.label && style.selectedOptionCard,
						]}
						onPress={() => {
							setSelectedFrequency(freq.label);
							setForm({ ...form, frequency: freq.label, times: freq.times });
						}}
					>
						<View
							style={[
								style.optionIcon,
								selectedFrequency === freq.label && style.selectedOptionIcon,
							]}
						>
							<Ionicons
								name={freq.icon}
								size={24}
								color={selectedFrequency === freq.label ? "white" : "#666"}
							/>
						</View>
						<Text
							style={[
								style.optionLabel,
								selectedFrequency === freq.label && style.selectedOptionLabel,
							]}
						>
							{freq.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	const renderDurationOptions = () => {
		return (
			<View style={style.optionsGrid}>
				{DURATIONS.map((dur) => (
					<TouchableOpacity
						key={dur.id}
						style={[
							style.optionCard,
							selectedDuration === dur.label && style.selectedOptionCard,
						]}
						onPress={() => {
							setSelectedDuration(dur.label);
							setForm({ ...form, duration: dur.label });
						}}
					>
						<Text
							style={[
								style.durationNumber,
								selectedDuration === dur.label && style.selectedDurationNumber,
							]}
						>
							{dur.value > 0 ? dur.value : "∞"}
						</Text>
						<Text
							style={[
								style.optionLabel,
								selectedDuration === dur.label && style.selectedOptionLabel,
							]}
						>
							{dur.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!form.name.trim()) {
			newErrors.name = "Medication name is required";
		}

		if (!form.dosage.trim()) {
			newErrors.dosage = "Dosage is required";
		}

		if (!form.frequency) {
			newErrors.frequency = "Frequency is required";
		}

		if (!form.duration) {
			newErrors.duration = "Duration is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!userId) {
			Alert.alert("Error", "User not authenticated");
			return;
		}

		if (!validateForm()) {
			Alert.alert("Error", "Please fill in all required fields correctly");
			return;
		}

		try {
			// Generate a random color
			const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];
			const randomColor = colors[Math.floor(Math.random() * colors.length)];

			const medicationData = {
				...form,
				startDate: form.startDate.toISOString(),
				color: randomColor,
			};

			const newMedication = await addMedication(userId, medicationData);

			if (newMedication && newMedication.reminderEnabled) {
				await scheduleMedicationReminder(newMedication);
			}

			Alert.alert(
				"Success",
				"Medication added successfully",
				[
					{
						text: "OK",
						onPress: () => router.back(),
					},
				],
				{ cancelable: false }
			);
		} catch (error) {
			console.error("Save error:", error);
			Alert.alert(
				"Error",
				"Failed to save medication. Please try again.",
				[{ text: "OK" }],
				{ cancelable: false }
			);
		}
	};

	return (
		<View className="flex-1 bg-[#f8f9fa]">
			<View
				className="bg-[#1976D2] absolute top-0 left-0 right-0"
				style={{ height: Platform.OS === "ios" ? 140 : 120 }}
			></View>

			<SafeAreaView
				className="flex-1"
				style={{ height: Platform.OS === "ios" ? 50 : 30 }}
			>
				{/* Header Information */}
				<View className="flex-row items-center px-5 pb-5 z-[1] pt-2">
					<TouchableOpacity
						className="w-10 h-10 rounded-[20px] bg-white justify-center items-center"
						style={style.buttonShadow}
						onPress={() => router.back()}
					>
						<Ionicons name="chevron-back" size={28} color={"#1976D2"} />
					</TouchableOpacity>
					<Text className="text-[28px] font-Outfit-Bold text-white ml-4">
						New Medication
					</Text>
				</View>

				<ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
					{/* Basic Information */}
					<View className="mb-[25px]">
						<View style={style.inputContainer}>
							<TextInput
								className="placeholder:font-Outfit-Regular "
								style={[style.mainInput, errors.name && style.inputError]}
								placeholder="Medication Name"
								placeholderTextColor={"#999"}
								value={form.name}
								onChangeText={(text) => {
									setForm({ ...form, name: text });
									if (errors.name) {
										setErrors({ ...errors, name: "" });
									}
								}}
							/>
							{errors.name && (
								<Text style={style.errorText}>{errors.name}</Text>
							)}
						</View>
						<View style={style.inputContainer}>
							<TextInput
								className="placeholder:font-Outfit-Regular"
								style={[style.mainInput, errors.name && style.inputError]}
								placeholder="Dosage (e.g., 500mg)"
								placeholderTextColor={"#999"}
								value={form.dosage}
								onChangeText={(text) => {
									setForm({ ...form, dosage: text });
									if (errors.dosage) {
										setErrors({ ...errors, dosage: "" });
									}
								}}
							/>
							{errors.dosage && (
								<Text style={style.errorText}>{errors.dosage}</Text>
							)}
						</View>
					</View>

					{/* Schedule */}
					<View className="mb-[25px]">
						<Text className="text-lg font-Outfit-Bold text-[#1a1a1a] mb-4">
							How often?
						</Text>
						{errors.frequency && (
							<Text style={style.errorText}>{errors.frequency}</Text>
						)}
						{renderFrequencyOptions()}

						<Text className="text-lg font-Outfit-Bold text-[#1a1a1a] mb-4 mt-3">
							For how long?
						</Text>
						{errors.duration && (
							<Text style={style.errorText}>{errors.duration}</Text>
						)}
						{renderDurationOptions()}

						<TouchableOpacity
							style={style.dateButton}
							onPress={() => setShowDatePicker(true)}
						>
							<View className="w-10 h-10 rounded-2xl bg-[#f5f5f5] items-center justify-center mr-3">
								<Ionicons name="calendar" size={20} color={"#1a8e2d"} />
							</View>
							<Text className="flex-1 font-Outfit-Regular text-base text-[#333]">
								Starts: {form.startDate.toLocaleDateString()}
							</Text>
							<Ionicons name="chevron-forward" size={20} color="#666" />
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								mode="date"
								value={form.startDate}
								onChange={(event, date) => {
									setShowDatePicker(false);
									if (date) {
										date.setHours(12, 0, 0, 0);
										setForm({ ...form, startDate: date });
									}
								}}
							/>
						)}

						{form.frequency && form.frequency !== "As needed" && (
							<View style={style.timesContainer}>
								<Text className="font-Outfit-Bold text-[#333] text-lg mb-3">
									Medication Times
								</Text>
								{form.times.map((time, index) => (
									<TouchableOpacity
										key={index}
										style={style.timeButton}
										onPress={() => {
											setShowTimePicker(true);
											setTimePickerIndex(index);
										}}
									>
										<View style={style.timeIconContainer}>
											<Ionicons name="time-outline" size={20} color="#1a8e2d" />
										</View>
										<Text style={style.timeButtonText}>{time}</Text>
										<Ionicons name="chevron-forward" size={20} color="#666" />
									</TouchableOpacity>
								))}
							</View>
						)}

						{showTimePicker && (
							<DateTimePicker
								mode="time"
								value={(() => {
									const [hours, minutes] = (form.times[0] || "09:00")
										.split(":")
										.map(Number);
									const date = new Date();
									date.setHours(hours, minutes, 0, 0);
									return date;
								})()}
								onChange={(event, date) => {
									setShowTimePicker(false);
									if (date) {
										const newTime = date.toLocaleTimeString("default", {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										});
										setForm((prev) => ({
											...prev,
											times: prev.times.map((time, index) =>
												index === timePickerIndex ? newTime : time
											),
										}));
									}
								}}
							/>
						)}
					</View>

					{/* Reminder */}
					<View className="mb-[25px]">
						<View style={style.card}>
							<View className="flex-row items-center">
								<View className="w-10 h-10 rounded-2xl bg-[#f5f5f5] items-center justify-center mr-3">
									<Ionicons size={20} name="notifications" color={"#1a8e2d"} />
								</View>

								<View className="flex-1">
									<Text className="font-Outfit-SemiBold text-lg text-[#333]">
										Reminders
									</Text>
									<Text className="font-Outfit-Regular text-base text-[#666] mt-[2px]">
										Get notified when its time to take your medications
									</Text>
								</View>

								<Switch
									trackColor={{ false: "#ddd", true: "#1976D2" }}
									thumbColor={"white"}
									value={form.reminderEnabled}
									onValueChange={(value) =>
										setForm({ ...form, reminderEnabled: value })
									}
								/>
							</View>
						</View>
					</View>

					{/* Notes */}
					<View className="mb-[25px]">
						<View style={style.textAreaContainer}>
							<TextInput
								className="h-[100px] p-3 text-[#333] font-Outfit-Regular text-base"
								placeholder="Add notes or special instructions..."
								placeholderTextColor="#999"
								value={form.notes}
								onChangeText={(text) => setForm({ ...form, notes: text })}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
							/>
						</View>
					</View>
				</ScrollView>

				{/* Add button */}
				<View className=" p-5 bg-white border-t border-t-[#e0e0e0]">
					<TouchableOpacity
						className={`rounded-lg mb-3 bg-[#1976D2] py-4 flex-row items-center justify-center ${loading ? "opacity-70" : ""}`}
						disabled={loading}
						onPress={handleSave}
					>
						{loading ? (
							<>
								<ActivityIndicator
									size="small"
									color="white"
									style={{ marginRight: 12 }}
								/>
								<Text className="text-white font-Outfit-Bold text-lg">
									Adding...
								</Text>
							</>
						) : (
							<>
								<Text className="text-white font-Outfit-Bold text-lg">
									Add Medication
								</Text>
							</>
						)}
					</TouchableOpacity>

					<TouchableOpacity
						className="py-4 rounded-lg border border-[#e0e0e0] justify-center items-center bg-white"
						onPress={() => router.back()}
						disabled={loading}
					>
						<Text className="text-[#666] font-Outfit-Bold text-lg">Cancel</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
};

const style = StyleSheet.create({
	buttonShadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	card: {
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	inputContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		marginBottom: 12,
		borderWidth: 1,
		padding: 15,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	mainInput: {
		fontSize: 20,
		color: "#333",
	},
	inputError: {
		borderColor: "#FF5252",
	},
	errorText: {
		color: "#ff5252",
		fontSize: 12,
		fontFamily: "Outfit-Regular",
		marginTop: 5,
	},
	dateButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginTop: 15,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
		marginBottom: 10,
	},
	optionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginHorizontal: -5,
		marginTop: 5,
	},
	optionCard: {
		width: (width - 60) / 2,
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		margin: 5,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	selectedOptionCard: {
		borderColor: "#1976D2",
		backgroundColor: "#2196F3",
	},
	textAreaContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	optionIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	selectedOptionIcon: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	optionLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		textAlign: "center",
	},
	selectedOptionLabel: {
		color: "white",
	},
	durationNumber: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1a8e2d",
		marginBottom: 5,
	},
	selectedDurationNumber: {
		color: "white",
	},
	timesContainer: {
		marginTop: 20,
	},
	timeButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	timeIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	timeButtonText: {
		flex: 1,
		fontSize: 16,
		fontFamily: "Outfit-Regular",
		color: "#333",
	},
});

export default add;
