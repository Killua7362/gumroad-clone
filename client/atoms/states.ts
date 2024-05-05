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

export const AllProdctsForUserFetcher = selector({
	key: 'AllProdctsForUserFetcher',
	get: async () => {
		let result: ProductTypePayload = {}
		await axios.get(`${window.location.origin}/api/products`, { withCredentials: true }).then(res => {
			for (let i = 0; i < res.data.data.length; i++) {
				result[res.data.data[i].id] = { ...res.data.data[i].attributes }
			}
			for (let i = 0; i < res.data.included.length; i++) {
				if (res.data.included[i].type === 'collab') {
					const { product_id, ...temp } = { ...res.data.included[i].attributes, product_id: "1" }
					result[res.data.included[i].attributes.product_id] = { ...result[res.data.included[i].attributes.product_id], collab: [...result[res.data.included[i].attributes.product_id].collab || [], { ...temp }] }
				}
			}
		}).catch((err) => {
			console.log(err)
		})
		return result
	},
	set: ({ get, set }, product: ProductTypePayload) => {
		set(AllProdctsForUser, { ...product })
	}
})

export const AllProdctsForUser = atom({
	key: 'AllProdctsForUser',
	default: AllProdctsForUserFetcher,
})

export const CollabProductsSelector = selector({
	key: 'CollabProductsSelector',
	get: async () => {
		let result: ProductTypePayload = {}
		await axios.get(`${window.location.origin}/api/collabs/products`, { withCredentials: true }).then(res => {
			for (let i = 0; i < res.data.data.length; i++) {
				result[res.data.data[i].id] = { ...res.data.data[i].attributes }
			}

			for (let i = 0; i < res.data.included.length; i++) {
				if (res.data.included[i].type === 'collab') {
					const { product_id, ...temp } = { ...res.data.included[i].attributes, product_id: "1" }
					result[res.data.included[i].attributes.product_id] = { ...result[res.data.included[i].attributes.product_id], collab: [...result[res.data.included[i].attributes.product_id].collab || [], { ...temp }] }
				}
			}
		}).catch(err => console.log(err))
		return result
	},
	set: ({ get, set }, product: ProductTypePayload) => {
		set(CollabProducts, { ...product })
	}
})
export const CollabProducts = atom({
	key: 'CollabProducts',
	default: CollabProductsSelector
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

export const hideToastState = atom({
	key: 'hideToastState',
	default: {
		active: true,
		message: ''
	}
})
