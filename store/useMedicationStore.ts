import { create } from "zustand";
import { db } from "@/lib/firebaseConfig";
import {
	collection,
	doc,
	addDoc,
	getDocs,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import type { Medication } from "@/types/Medication";

interface MedicationState {
	medications: Medication[];
	loading: boolean;
	error: string | null;
	addMedication: (
		userId: string,
		medications: Omit<Medication, "id">
	) => Promise<Medication | undefined>;
	fetchMedication: (userId: string) => Promise<void>;
	updateMedication: (
		userId: string,
		medicationId: string,
		updatedData: Partial<Omit<Medication, "id">> // Partial to allow updating some fields
	) => Promise<Medication | undefined>;
	deleteMedication: (userId: string, medicationId: string) => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
	loading: false,
	medications: [],
	error: null,

	addMedication: async (userId, medicationData) => {
		set({ loading: true, error: null });
		if (!userId) {
			const error = new Error("User ID is missing.");
			set({ loading: false, error: error.message });
			throw error;
		}

		try {
			const medCollectionRef = collection(db, "users", userId, "medications");
			const docref = await addDoc(medCollectionRef, medicationData);

			const newMedication: Medication = {
				id: docref.id,
				...medicationData,
			} as Medication;

			set((prevState) => ({
				loading: false,
				medications: [...prevState.medications, newMedication],
			}));
			return newMedication;
		} catch (e) {
			const error = e as Error; // Type assertion
			set({ loading: false, error: error.message });
			console.error("Medication add unsuccessful:", error);
			throw error;
		}
	},

	fetchMedication: async (userId) => {
		set({ loading: true, error: null });
		if (!userId) {
			const error = new Error("User ID is missing.");
			set({ loading: false, error: error.message });
			throw error;
		}

		try {
			const medCollectionRef = collection(db, "users", userId, "medications");
			const querySnapshot = await getDocs(medCollectionRef);

			const userMedications = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Medication[];

			set({ medications: userMedications, loading: false });
		} catch (e) {
			const error = e as Error;
			console.error("Medications fetch unsuccessful:", error);
			set({ loading: false, error: error.message });
			throw error;
		}
	},

	deleteMedication: async (userId, medicationId) => {
		set({ loading: true, error: null });
		try {
			const medDocRef = doc(db, "users", userId, "medications", medicationId);
			await deleteDoc(medDocRef);

			set((state) => ({
				medications: state.medications.filter((med) => med.id !== medicationId),
				loading: false,
			}));
			console.log("Medication deleted successfully!");
		} catch (e) {
			const error = e as Error;
			console.error("Medication delete unsuccessful:", error);
			set({ loading: false, error: error.message });
			throw error;
		}
	},

	updateMedication: async (userId, medicationId, updatedData) => {
		set({ loading: true, error: null });
		try {
			const medDocRef = doc(db, "users", userId, "medications", medicationId);
			await updateDoc(medDocRef, updatedData);

			const originalMedication = get().medications.find(
				(m) => m.id === medicationId
			);

			if (!originalMedication) {
				throw new Error("Medication to update not found in local state.");
			}

			const updatedMedication: Medication = {
				...originalMedication,
				...updatedData,
			};

			set((state) => ({
				medications: state.medications.map((med) =>
					med.id === medicationId ? updatedMedication : med
				),
				loading: false,
			}));

			console.log("Medication updated successfully!");
			return updatedMedication;
		} catch (e) {
			const error = e as Error;
			console.error("Medication update unsuccessful:", error);
			set({ loading: false, error: error.message });
			throw error;
		}
	},
}));
