declare const Alpine: {
	data: (name: string, callback: () => Record<string, unknown>) => void;
	store: (name: string, value: Record<string, unknown>) => void;
};
