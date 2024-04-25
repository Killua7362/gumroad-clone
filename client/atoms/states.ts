import axios from "axios";
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

const allProductsSetFunction = (set: SetRecoilState, get: GetRecoilValue, product: ProductTypePayload) => {
	set(AllProdctsForUser, { ...product })
}

export const AllProdctsForUserFetcher = selector({
	key: 'AllProdctsForUserFetcher',
	get: async () => {
		let result: ProductTypePayload = {}
		await axios.get(`${window.location.origin}/api/products`, { withCredentials: true }).then(res => {
			for (let i = 0; i < res.data.data.length; i++) {
				result[res.data.data[i].id] = { ...res.data.data[i].attributes }
			}
		}).catch((err) => {
			console.log(err)
		})
		return result
	},
	set: ({ get, set }, product: ProductTypePayload) => {
		allProductsSetFunction(set, get, product)
	}
})

export const AllProdctsForUser = atom({
	key: 'AllProdctsForUser',
	default: AllProdctsForUserFetcher,
})

export const ContentPage = atom({
	key: 'ContentPage',
	default: {}
})

export const loginStatuFetcher = selector({
	key: 'loginStatuFetcher',
	get: async () => {
		const logged_in: authSchema = await axios.get(`${window.location.origin}/api/sessions/logged_in`).then(res => res.data).catch((err) => err.response.data)
		return logged_in
	},
	set: ({ get, set }, value: authSchema) => {
		set(loginStatuState, value)
	}
})

export const loginStatuState = atom({
	key: 'loginStatuState',
	default: loginStatuFetcher
})
