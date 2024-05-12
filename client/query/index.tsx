import { queryClient } from "@/app/RootPage";
import { useQuery } from "@tanstack/react-query";

export const loginStatusFetcher = () => {
	const { data, isSuccess, isPending } = useQuery({
		queryFn: () => fetch(`${window.location.origin}/api/sessions/logged_in`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		meta: {
			persist: false
		},
		queryKey: ['loginStatus'],
	});

	return { data, isSuccess, isPending };
}

export const allProductsFetcher = () => {
	const { data, isSuccess, isPending } = useQuery({
		queryKey: ['allProducts'],
		queryFn: () => fetch(`${window.location.origin}/api/products`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				let result: ProductTypePayload = {}
				for (let i = 0; i < data.data.length; i++) {
					result[data.data[i].id] = { ...data.data[i].attributes }
				}
				return result;
			})
		}),
		meta: {
			persist: true
		},
		enabled: (queryClient.getQueryData(['loginStatus']) && (queryClient.getQueryData(['loginStatus']) as authSchema).logged_in == true) as boolean
	})

	return { data, isSuccess, isPending };
}

export const collabsProductFetcher = () => {

	const { data, isSuccess, isPending } = useQuery({
		queryKey: ['collabProducts'],
		queryFn: () => fetch(`${window.location.origin}/api/collabs/products`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				console.log(data)
				let result: ProductTypePayload = {}
				for (let i = 0; i < data.data.length; i++) {
					result[data.data[i].id] = { ...data.data[i].attributes }
				}
				return result;
			})
		}),
		meta: {
			persist: false
		},
		enabled: (queryClient.getQueryData(['loginStatus']) && (queryClient.getQueryData(['loginStatus']) as authSchema).logged_in == true) as boolean
	})

	return { data, isSuccess, isPending };

}

export const singleProductFetcher = ({ productId }: { productId: string | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		queryKey: ['allProducts', productId!],
		queryFn: () => {
			if (queryClient.getQueryData(['allProducts'])) {
				return (queryClient.getQueryData(['allProducts']) as ProductTypePayload)[productId!]
			} else {
				return fetch(`${window.location.origin}/api/products/${productId!}`).then(async (res) => {
					if (!res.ok) {
						const errorMessage: string = await res.json().then(data => data.error);
						return Promise.reject(new Error(errorMessage));
					}
					return res.json().then(data => {
						const { id, ...temp } = { ...data.data.attributes, id: '' }
						return temp;
					});
				})
			}
		},
		meta: { persist: true },
		enabled: !!productId,
	})

	return { data, isSuccess, isPending };

}

export const profileProductsFetcher = ({ productId, preview }: { productId: string | undefined, preview: boolean }) => {
	const { data, isSuccess, isPending } = useQuery({
		queryKey: ['profileProducts', productId!],
		queryFn: () => fetch(`${window.location.origin}/api/profiles/${productId!}`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				let result: ProductTypePayload = {}
				for (let i = 0; i < data.data.length; i++) {
					result[data.data[i].id] = { ...data.data[i].attributes }
				}
				return result;
			})
		}),
		meta: {
			persist: false
		},
		enabled: !!productId && !preview,
	})

	return { data, isSuccess, isPending };
}
