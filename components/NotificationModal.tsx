import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import { Medication } from "@/types/Medication";

interface NotificationModalProps {
	visible: boolean;
	onClose: () => void;
	medi: Medication[];
}

const NotificationModal = ({
	visible,
	onClose,
	medi,
}: NotificationModalProps) => {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			statusBarTranslucent={true}
		>
			<View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
				<View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
					<View className="flex-row justify-between items-center mb-5">
						<Text className="font-Outfit-Bold text-[#333] text-[20px]">
							Notifications
						</Text>
						<TouchableOpacity className="p-[5px]" onPress={onClose}>
							<Ionicons name="close" size={25} color="#333" />
						</TouchableOpacity>
					</View>
					{medi.map((medication) => (
						<View
							key={medication.id}
							className="flex-row p-4 rounded-xl bg-[#f5f5f5] mb-3"
						>
							<View
								style={{ backgroundColor: `${medication.color}15` }}
								className={`w-10 h-10 rounded-3xl justify-center items-center mr-4`}
							>
								<Ionicons name="medical" size={24} color={medication.color} />
							</View>
							<View className="flex-1">
								<Text className="font-Outfit-SemiBold text-base text-[#333] mb-1">
									{medication.name}
								</Text>
								<Text className="text-[14px] text-[#666] mb-4">
									{medication.dosage}
								</Text>
								<Text className="text-[12px] text-[#999] ">
									{medication.times.join(', ')}
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({});
export default NotificationModal;
