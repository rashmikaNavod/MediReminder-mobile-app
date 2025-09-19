import React from "react";
import {
	Modal,
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserResource } from "@clerk/types";

interface UserMenuModalProps {
	visible?: boolean;
	onClose?: () => void;
	onSignOut?: () => void;
	user?: UserResource | null | undefined;
}

const UserMenuModal = ({
	visible,
	onClose,
	onSignOut,
	user,
}: UserMenuModalProps) => {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			statusBarTranslucent={true}
		>
			<View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
				<View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
					<TouchableOpacity onPress={onClose}>
						<Ionicons
							name="close"
							size={25}
							color="#333"
							className="self-end"
						/>
					</TouchableOpacity>
					<View className="items-center mb-6">
						{user?.imageUrl && (
							<Image
								source={{ uri: user.imageUrl }}
								className="w-20 h-20 rounded-full"
							/>
						)}
						<Text className="text-xl font-Outfit-Bold text-[#333] mt-3">
							{user?.fullName}
						</Text>
						<Text className="text-base font-Outfit-Regular text-[#666]">
							{user?.primaryEmailAddress?.emailAddress}
						</Text>
					</View>
					<TouchableOpacity className="flex-row items-center p-4 border-b border-gray-300">
						<Ionicons name="person-circle-outline" size={25} color="#3F51B5" />
						<Text className="ml-4 text-base font-Outfit-SemiBold text-[#666]">
							Manage Account
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onSignOut}
						className="flex-row items-center p-4"
					>
						<Ionicons name="log-out-outline" size={25} color="#f44336" />
						<Text className="ml-4 text-base font-Outfit-SemiBold text-red-600">
							Sign Out
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({});
export default UserMenuModal;

// 		{/* Menu Options */}
// 		<TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
// 			<Ionicons name="person-circle-outline" size={24} color="#3F51B5" />
// 			<Text className="ml-4 text-base font-Outfit-Medium text-gray-700">
// 				Manage Account
// 			</Text>
// 		</TouchableOpacity>

// 		<TouchableOpacity
// 			onPress={handleSignOut}
// 			className="flex-row items-center p-4"
// 		>
// 			<Ionicons name="log-out-outline" size={24} color="#f44336" />
// 			<Text className="ml-4 text-base font-Outfit-Medium text-red-600">
// 				Sign Out
// 			</Text>
// 		</TouchableOpacity>
// 	</View>
// </Modal>; */}
