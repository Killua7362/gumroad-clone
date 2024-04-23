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

interface ProductsCardContextMenu {
	active: boolean;
	activeIdx: number;
	id?: string;
}


interface productCategories {
	name: string;
	hide: boolean;
}


interface IndividualCollab {
	email: string;
	share: number;
	approved: boolean;
}

interface ProductType {
	id: string;
	title: string;
	type: string;
	live: boolean;
	price: number;
	collab_active: boolean;
	collab?: IndividualCollab[];
	thumbimageSource?: string;
	coverimageSource?: string;
	description: string;
	summary: string;
}

interface authSchema {
	logged_in: boolean;
	email?: string;
	name?: string;
}
