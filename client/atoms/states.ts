import { GetRecoilValue, SetRecoilState, atom, selector } from "recoil";

export const productsCardContextMenu = atom({
	key: "productsCardContextMenu",
	default: {
		active: false,
		activeIdx: 0,
		id: ""
	} as ProductsCardContextMenu
})

export const productsEditContentContextMenu = atom({
	key: 'productsEditContentContextMenu',
	default: {
		active: false,
		pageId: '0',
		points: [0, 0]
	}
})

export const modalBaseActive = atom({
	key: 'modalBaseActive',
	default: {
		active: false,
		type: ""
	}
})

export const ContentPage = atom({
	key: 'ContentPage',
	default: {}
})

export const hideToastState = atom({
	key: 'hideToastState',
	default: {
		active: true,
		message: ''
	}
})
