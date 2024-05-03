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
	startsWith:string;
}

interface ProductsCardContextMenu {
	active: boolean;
	activeIdx: number;
	id?: string;
}
interface productsEditContentContextMenu {
	active: boolean;
	pageId: string;
	points: number[];
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

interface ProductContetPage {
	[id: string]: {
		name: string;
		content: string;
	}
}

interface Review {
	[id: string]: {
		title: string;
		description: string;
		score: number;
	}
}


interface ProductType {
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
	product_content?: ProductContetPage
}

interface ProductTypePayload {
	[id: string]: ProductType
}

interface authSchema {
	logged_in: boolean;
	email?: string;
	name?: string;
}

