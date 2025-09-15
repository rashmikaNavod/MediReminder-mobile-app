import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { View, Text, Button, Image } from "react-native";

const HomeScreen = () => {
	const { user } = useUser();
	const { signOut } = useAuth();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				padding: 20,
			}}
		>
			{user?.imageUrl && (
				<Image
					source={{ uri: user.imageUrl }}
					style={{
						width: 100,
						height: 100,
						borderRadius: 50,
						marginBottom: 20,
					}}
				/>
			)}
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
				Welcome, {user?.firstName}!
			</Text>
			<Text style={{ fontSize: 16, color: "gray", marginBottom: 40 }}>
				{user?.primaryEmailAddress?.emailAddress}
			</Text>
			<Button title="Sign Out" onPress={() => signOut()} color="#f44336" />
		</View>
	);
};

export default HomeScreen;
