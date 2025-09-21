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
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useMedicationStore } from "@/store/useMedicationStore";
import { scheduleMedicationReminder } from "@/lib/notification";
import { Medication } from "@/types/Medication";

// Form state එකේ type එක define කරනවා
type MedicationFormData = Omit<Medication, "startDate"> & {
	startDate: Date;
};

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

const Update = () => {
	const router = useRouter();
	const { userId } = useAuth();
	const { id: medicationId } = useLocalSearchParams<{ id: string }>();
	const { loading, updateMedication, medications } = useMedicationStore();

	const [form, setForm] = useState<MedicationFormData | null>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [timePickerIndex, setTimePickerIndex] = useState(0);

	// Selected Frequency/Duration සඳහා වෙනම state අවශ්‍ය නෑ, form state එකෙන්ම ගන්න පුළුවන්
	// const [selectedFrequency, setSelectedFrequency] = useState("");
	// const [selectedDuration, setSelectedDuration] = useState("");

	useEffect(() => {
		console.log(medicationId)
		if (medicationId) {
			const medicationToUpdate = medications.find((m) => m.id === medicationId);
			
			if (medicationToUpdate) {
				setForm({
					...medicationToUpdate,
					startDate: new Date(medicationToUpdate.startDate), // Convert string to Date
				});
			}
		}
	}, [medicationId, medications]);

	const handleUpdate = async () => {
		if (!userId || !medicationId || !form) {
			Alert.alert("Error", "Required information is missing.");
			return;
		}

		// Validation
		const newErrors: { [key: string]: string } = {};
		if (!form.name.trim()) newErrors.name = "Medication name is required";
		if (!form.dosage.trim()) newErrors.dosage = "Dosage is required";
		if (!form.frequency) newErrors.frequency = "Frequency is required";
		if (!form.duration) newErrors.duration = "Duration is required";
		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			Alert.alert("Error", "Please fill in all required fields correctly");
			return;
		}

		try {
			// Prepare data for Firestore
			const { id, name, ...dataToUpdate } = form; // id සහ name අයින් කරගන්නවා
			const medicationDataForFirebase = {
				...dataToUpdate,
				startDate: form.startDate.toISOString(), // Date object එක string කරනවා
			};

			const updatedMed = await updateMedication(
				userId,
				medicationId,
				medicationDataForFirebase
			);

			if (updatedMed) {
				await scheduleMedicationReminder(updatedMed);
			}

			Alert.alert(
				"Success",
				"Medication updated successfully",
				[{ text: "OK", onPress: () => router.back() }],
				{ cancelable: false }
			);
		} catch (error) {
			console.error("Update error:", error);
			Alert.alert("Error", "Failed to update medication. Please try again.");
		}
	};

	if (!form) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#FFFFFF" />
				<Text style={styles.loadingText}>Loading medication details...</Text>
			</View>
		);
	}

	return (
		<View style={styles.flex1}>
			<View
				style={[
					styles.headerBackground,
					{ height: Platform.OS === "ios" ? 140 : 120 },
				]}
			/>
			<SafeAreaView style={styles.flex1}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.back()}
					>
						<Ionicons name="chevron-back" size={28} color="#1976D2" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Update Medication</Text>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					{/* Medication Name (Read-only) */}
					<View style={styles.inputContainer}>
						<TextInput
							style={[styles.mainInput, styles.disabledInput]}
							value={form.name}
							editable={false}
						/>
					</View>

					{/* Dosage */}
					<View style={styles.inputContainer}>
						<TextInput
							style={[
								styles.mainInput,
								errors.dosage ? styles.inputError : null,
							]}
							placeholder="Dosage (e.g., 500mg)"
							value={form.dosage}
							onChangeText={(text) => setForm({ ...form, dosage: text })}
						/>
					</View>

					{/* How Often? */}
					<Text style={styles.sectionTitle}>How often?</Text>
					<View style={styles.optionsGrid}>
						{FREQUENCIES.map((freq) => (
							<TouchableOpacity
								key={freq.id}
								style={[
									styles.optionCard,
									form.frequency === freq.label && styles.selectedOptionCard,
								]}
								onPress={() =>
									setForm({ ...form, frequency: freq.label, times: freq.times })
								}
							>
								<View
									style={[
										styles.optionIcon,
										form.frequency === freq.label && styles.selectedOptionIcon,
									]}
								>
									<Ionicons
										name={freq.icon}
										size={24}
										color={form.frequency === freq.label ? "white" : "#666"}
									/>
								</View>
								<Text
									style={[
										styles.optionLabel,
										form.frequency === freq.label && styles.selectedOptionLabel,
									]}
								>
									{freq.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* How Long? */}
					<Text style={styles.sectionTitle}>For how long?</Text>
					<View style={styles.optionsGrid}>
						{DURATIONS.map((dur) => (
							<TouchableOpacity
								key={dur.id}
								style={[
									styles.optionCard,
									form.duration === dur.label && styles.selectedOptionCard,
								]}
								onPress={() => setForm({ ...form, duration: dur.label })}
							>
								<Text
									style={[
										styles.durationNumber,
										form.duration === dur.label &&
											styles.selectedDurationNumber,
									]}
								>
									{dur.value > 0 ? dur.value : "∞"}
								</Text>
								<Text
									style={[
										styles.optionLabel,
										form.duration === dur.label && styles.selectedOptionLabel,
									]}
								>
									{dur.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Start Date */}
					<TouchableOpacity
						style={styles.dateButton}
						onPress={() => setShowDatePicker(true)}
					>
						<Ionicons
							name="calendar"
							size={20}
							color="#1976D2"
							style={{ marginRight: 10 }}
						/>
						<Text>Starts: {form.startDate.toLocaleDateString()}</Text>
					</TouchableOpacity>
					{showDatePicker && (
						<DateTimePicker
							mode="date"
							value={form.startDate}
							onChange={(event, date) => {
								setShowDatePicker(false);
								if (date) {
									setForm({ ...form, startDate: date });
								}
							}}
						/>
					)}

					{/* Medication Times */}
					{form.frequency && form.frequency !== "As needed" && (
						<View style={{ marginTop: 15 }}>
							{form.times.map((time, index) => (
								<TouchableOpacity
									key={index}
									style={styles.timeButton}
									onPress={() => {
										setTimePickerIndex(index);
										setShowTimePicker(true);
									}}
								>
									<Ionicons
										name="time-outline"
										size={20}
										color="#1976D2"
										style={{ marginRight: 10 }}
									/>
									<Text>{time}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}

					{showTimePicker && (
						<DateTimePicker
							mode="time"
							value={(() => {
								const [h, m] = (form.times[timePickerIndex] || "00:00")
									.split(":")
									.map(Number);
								const d = new Date();
								d.setHours(h, m);
								return d;
							})()}
							onChange={(event, date) => {
								setShowTimePicker(false);
								if (date) {
									const newTime = date.toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
									});
									setForm((prev) => {
										if (!prev) return null;
										return {
											...prev,
											times: prev.times.map((time, index) =>
												index === timePickerIndex ? newTime : time
											),
										};
									});
								}
							}}
						/>
					)}

					{/* Reminders & Notes... */}
				</ScrollView>
				<View style={styles.footer}>
					<TouchableOpacity
						style={[styles.button, styles.updateButton]}
						onPress={handleUpdate}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text style={styles.buttonText}>Update Medication</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.cancelButton]}
						onPress={() => router.back()}
						disabled={loading}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	flex1: { flex: 1, backgroundColor: "#f8f9fa" },
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
	},
	loadingText: { marginTop: 10, fontSize: 16, color: "#333" },
	headerBackground: {
		backgroundColor: "#1976D2",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingBottom: 20,
		paddingTop: 10,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
	},
	headerTitle: {
		fontSize: 28,
		fontFamily: "Outfit-Bold",
		color: "white",
		marginLeft: 16,
	},
	scrollContent: { padding: 20 },
	inputContainer: {
		backgroundColor: "white",
		borderRadius: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		elevation: 2,
		padding: 10,
	},
	mainInput: {
		fontSize: 18,
		fontFamily: "Outfit-Regular",
		paddingHorizontal: 10,
	},
	disabledInput: { backgroundColor: "#f0f0f0", color: "#888" },
	inputError: { borderColor: "#FF5252" },
	sectionTitle: {
		fontSize: 18,
		fontFamily: "Outfit-Bold",
		color: "#1a1a1a",
		marginBottom: 10,
		marginTop: 15,
	},
	optionsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	optionCard: {
		width: (width - 50) / 2,
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginBottom: 10,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		elevation: 2,
	},
	selectedOptionCard: { borderColor: "#1976D2", backgroundColor: "#2196F3" },
	optionIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	selectedOptionIcon: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
	optionLabel: {
		fontSize: 14,
		fontFamily: "Outfit-SemiBold",
		color: "#333",
		textAlign: "center",
	},
	selectedOptionLabel: { color: "white" },
	durationNumber: {
		fontSize: 24,
		fontFamily: "Outfit-Bold",
		color: "#1976D2",
		marginBottom: 5,
	},
	selectedDurationNumber: { color: "white" },
	dateButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginTop: 15,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	timeButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 15,
		marginBottom: 10,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	footer: {
		padding: 20,
		backgroundColor: "white",
		borderTopWidth: 1,
		borderColor: "#e0e0e0",
	},
	button: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
	updateButton: { backgroundColor: "#1976D2", marginBottom: 10 },
	buttonText: { color: "white", fontSize: 18, fontFamily: "Outfit-Bold" },
	cancelButton: { borderWidth: 1, borderColor: "#e0e0e0" },
	cancelButtonText: { color: "#666", fontSize: 18, fontFamily: "Outfit-Bold" },
});

export default Update;
