declare module '*.css'

interface divVariants {
	initial?: {
		width?: string;
	};
	animate?: {
		width?: string;
		transition?: {
			duration?: number;
		}
	};
}
