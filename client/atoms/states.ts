import { GetRecoilValue, SetRecoilState, atom, selector } from "recoil";

export const productsCardContextMenu = atom({
	key: "productsCardContextMenu",
	default: {
		active: false,
		activeIdx: 0,
		id: ""
	} as ProductsCardContextMenu
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
