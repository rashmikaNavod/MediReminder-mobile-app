export type Medication = {
	id: string;
	name: string;
	dosage: string;
	times: string[];
	frequency: string;
	startDate: string;
	duration: string;
	color: string;
	notes?: string;
	reminderEnabled: boolean;
	takenHistory?: { [date: string]: string[] };
};
