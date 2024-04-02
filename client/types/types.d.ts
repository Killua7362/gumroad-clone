declare module '*.css'

interface pupilPos {
	left: string;
	top: string;
}

interface sortConfig {
	active: boolean;
	byType: string;
	reverse: boolean;
}

interface searchConfig {
	active: boolean;
}

interface ProductCardData {
	imageSource?: string
}

interface ProductsCardContextMenu {
	active:boolean;
	activeIdx:number;
}
