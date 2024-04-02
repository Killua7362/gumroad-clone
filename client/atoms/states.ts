import { atom } from "recoil";

export const productsCardContextMenu = atom({
	key: "productsCardContextMenu",
	default: {
		active: false,
		activeIdx: 0
	} as ProductsCardContextMenu
})
