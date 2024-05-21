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
	startsWith: string;
}

interface toastMessage {
	active: boolean;
	message?: string;
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
	name: string;
	content: string;
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
	tags: string;
	live: boolean;
	price: number;
	collab_active: boolean;
	collabs?: IndividualCollab[];
	thumbimageSource?: string;
	coverimageSource?: string;
	description: string;
	summary: string;
	product_content?: ProductContetPage[];
}

interface ProductTypePayload {
	[id: string]: ProductType
}

interface authSchema {
	logged_in: boolean;
	email?: string;
	name?: string;
	user_id?: string;
}

type Entries<T> = {
	[K in keyof T]: [key: K, value: T[K]];
}[keyof T][];

interface PageSchema {
	name: string;
	content: string;
}
