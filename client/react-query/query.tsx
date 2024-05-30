import { queryClient } from "@/app/RootPage";
import { useQuery } from "@tanstack/react-query";

export const loginStatusFetcherProps = {
	queryFn: () => fetch(`${window.location.origin}/api/sessions/logged_in`).then(async (res) => {
		if (!res.ok) {
			const errorMessage: string = await res.json().then(data => data.error)
			return Promise.reject(new Error(errorMessage))
		}
		return res.json()
	}),
}


export const loginStatusFetcher = () => {
	const { data, isSuccess, isPending } = useQuery(
		{
			...loginStatusFetcherProps,
			meta: {
				persist: false
			},
			queryKey: ['loginStatus'],

		}
	);

	return { data, isSuccess, isPending } as {
		data: authSchema;
		isSuccess: boolean;
		isPending: boolean;
	};
}

export const allProductsFetcherProps = {
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
}
export const allProductsFetcher = ({ initialData }: { initialData?: ProductTypePayload | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		...allProductsFetcherProps,
		meta: {
			persist: false
		},
		enabled: (queryClient.getQueryData(['loginStatus']) && (queryClient.getQueryData(['loginStatus']) as authSchema).logged_in == true) as boolean,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: ProductTypePayload;
		isSuccess: boolean;
		isPending: boolean;
	};
}

export const collabsProductFetcherProps = {
	queryKey: ['collabProducts'],
	queryFn: () => fetch(`${window.location.origin}/api/collabs/products`).then(async (res) => {
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
}

export const collabsProductFetcher = ({ initialData }: { initialData: ProductTypePayload | undefined }) => {

	const { data, isSuccess, isPending } = useQuery({
		...collabsProductFetcherProps,
		meta: {
			persist: false
		},
		enabled: (queryClient.getQueryData(['loginStatus']) && (queryClient.getQueryData(['loginStatus']) as authSchema).logged_in == true) as boolean,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: ProductTypePayload;
		isSuccess: boolean;
		isPending: boolean;
	};


}

export const singleProductFetcherProps = ({ productId }: { productId: string | undefined }) => {
	return {
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
	}
}

export const singleProductFetcher = ({ productId, initialData }: { productId: string | undefined, initialData?: ProductType | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		...singleProductFetcherProps({ productId }),
		meta: { persist: true },
		enabled: !!productId,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: ProductType;
		isSuccess: boolean;
		isPending: boolean;
	};

}

export const getProfileProductsFetcherProps = ({ userId }: { userId: string | undefined }) => {
	return {
		queryKey: ['profileProducts', userId!],
		queryFn: () => fetch(`${window.location.origin}/api/profiles/${userId!}`).then(async (res) => {
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
	}
}
export const getProfileProductsFetcher = ({ userId, initialData }: { userId: string | undefined, initialData?: ProductTypePayload | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		...getProfileProductsFetcherProps({ userId }),
		meta: {
			persist: false
		},
		enabled: !!userId,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: ProductTypePayload;
		isSuccess: boolean;
		isPending: boolean;
	};

}

export const getSingleProfileProductFetcherProps = ({ userId, productId }: { userId: string | undefined, productId: string | undefined }) => {
	return {
		queryKey: ['profileProducts', userId!, productId!],
		queryFn: () => {
			if (queryClient.getQueryData(['profileProducts', userId!])) {
				return (queryClient.getQueryData(['profileProducts', userId!]) as ProductTypePayload)[productId!]
			} else {
				return fetch(`${window.location.origin}/api/profiles/${userId!}/${productId!}`).then(async (res) => {
					if (!res.ok) {
						const errorMessage: string = await res.json().then(data => data.error)
						return Promise.reject(new Error(errorMessage))
					}
					return res.json().then(data => {
						return { ...data.data.attributes } as ProductType;
					})
				})
			}
		},

	}
}

export const getSingleProfileProductFetcher = ({ userId, productId, preview, initialData }: { userId: string | undefined, productId: string | undefined, preview: boolean, initialData?: ProductType | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		...getSingleProfileProductFetcherProps({ userId, productId }),
		meta: {
			persist: false
		},
		enabled: !!userId && !!productId && !preview,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: ProductType;
		isSuccess: boolean;
		isPending: boolean;
	};
}

export const getProfileStatusProps = ({ userId }: { userId: string | undefined }) => {
	return {
		queryKey: ['profileStatus', userId!],
		queryFn: () => fetch(`${window.location.origin}/api/profile/${userId!}`).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json().then(data => {
				return { ...data.data.attributes } as CheckoutFormSchemaType
			})
		}),
	}
}

export const getProfileStatus = ({ userId, preview, initialData }: { userId: string | undefined, preview: boolean, initialData?: CheckoutFormSchemaType | undefined }) => {
	const { data, isSuccess, isPending } = useQuery({
		...getProfileStatusProps({ userId }),
		meta: {
			persist: false
		},
		enabled: !!userId && !preview,
		initialData
	})

	return { data, isSuccess, isPending } as {
		data: CheckoutFormSchemaType;
		isSuccess: boolean;
		isPending: boolean;
	};
}
