import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/app/RootPage"
import { hideToastState } from "@/atoms/states"
import { useSetRecoilState } from "recoil"
import { useNavigate } from "react-router"
import React from "react"
import { z } from 'zod'
import { signInSchema, signUpSchema } from "@/forms/schema/auth_schema"
import { UseFormSetError } from "react-hook-form"
import { EditProductSchema } from "@/forms/schema/edit_product_schema"

// adding id to all delete function and modal
export const getProductDeleter = () => {

	const { mutate, isPending } = useMutation({
		mutationFn: (id: string) => fetch(`${window.location.origin}/api/products/${id}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return {}
		}),
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: ['allProducts', id!], exact: true })
			return queryClient.invalidateQueries({ queryKey: ['allProducts'], exact: true })
		},
		onError: (err) => {
			console.log(err)
		},
		onSettled: () => {
		}
	})

	return { mutate, isPending } as { mutate: (id: string) => void, isPending: boolean }
}

export const getProductCreater = () => {
	const { mutate, isPending } = useMutation({
		mutationFn: (payload: ProductType) => fetch(`${window.location.origin}/api/products`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: ['allProducts'] })
		},
		onError: (err) => { },
		onSettled: () => {
		}
	})

	return { mutate, isPending } as { mutate: (payload: ProductType) => void, isPending: boolean }
}

export const setLogOut = () => {
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: () => fetch(`${window.location.origin}/api/sessions/logout`, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			navigate('/signin')
			return queryClient.clear()
		},
		onError: (err) => {

		}
	})

	return { mutate, isPending } as { mutate: () => void, isPending: boolean }
}

export const getCollabApprover = () => {
	const { mutate, isPending } = useMutation({
		mutationFn: (key: string) => fetch(`${window.location.origin}/api/collabs/${key}/approve`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({}),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			return queryClient.invalidateQueries({ queryKey: ['collabProducts'] })
		},
		onError: (err) => { },
	})

	return { mutate, isPending } as { mutate: (key: string) => void, isPending: boolean }
}

export const getProductEditor = ({ setError }: { setError: UseFormSetError<EditProductSchemaType> }) => {
	const setToastRender = useSetRecoilState(hideToastState)

	const { mutate: productSet, isPending: productIsSetting } = useMutation({
		mutationFn: ({ payload, id }: { payload: ProductType, id: string }) => fetch(`${window.location.origin}/api/products/${id}`, {
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: (data, { payload, id }) => {
			setToastRender({
				active: false,
				message: 'Product updated successfully'
			})
			queryClient.invalidateQueries({ queryKey: ['allProducts', id!], exact: true })
			return queryClient.invalidateQueries({ queryKey: ['allProducts'], exact: true })
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		}
	})

	const { mutate, isPending } = useMutation({
		mutationFn: ({ payload, id }: { payload: ProductType, id: string }) => fetch(`${window.location.origin}/api/collabs/validate_user`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ collabs: [...payload.collabs!].map(e => e.email) }),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: (data, { payload, id }) => {
			if (data.valid) {
				productSet({ payload: { ...payload }, id })
			} else {
				(data.data || []).map((e: string, index: number) => {
					e &&
						setError(`collabs.${index}.email`, {
							type: `collabs.${index}.email`,
							message: e
						})
				})
			}
		},
		onError: (error) => { }
	})

	return { mutate, isPending } as { mutate: ({ payload, id }: { payload: ProductType, id: string }) => void, isPending: boolean }
}

export const getProductLiveToggle = () => {
	const setToastRender = useSetRecoilState(hideToastState)

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: { key: string, live: boolean }) => fetch(`${window.location.origin}/api/products/${payload.key}`, {
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({ live: payload.live }),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: (data, payload) => {
			queryClient.invalidateQueries({ queryKey: ['allProducts', payload.key!], exact: true })
			return queryClient.invalidateQueries({ queryKey: ['allProducts'], exact: true })
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		}
	})

	return { mutate, isPending } as { mutate: (payload: { key: string, live: boolean }) => void, isPending: boolean }
}

export const setLoginStatus = ({ setCustomError }: { setCustomError: React.Dispatch<React.SetStateAction<string>> }) => {
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: signInSchemaType) => fetch(`${window.location.origin}/api/sessions`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return res.json()
		}),
		onSuccess: () => {
			navigate('/')
			return queryClient.clear()
		},
		onError: (err) => {
			setCustomError(err.message)
		}
	})
	return { mutate, isPending } as { mutate: (payload: signInSchemaType) => void, isPending: boolean }

}

export const setSignUp = ({ setCustomError }: { setCustomError: React.Dispatch<React.SetStateAction<string>> }) => {
	const navigate = useNavigate()

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: signUpSchemaType) => fetch(`${window.location.origin}/api/registrations`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return {}
		}),
		onSuccess: () => {
			navigate('/signin')
		},
		onError: (err) => {
			setCustomError(err.message)
		},
	})

	return { mutate, isPending } as { mutate: (payload: signUpSchemaType) => void, isPending: boolean }
}

export const getProfileStatusSetter = ({ userId }: { userId: string }) => {
	const setToastRender = useSetRecoilState(hideToastState)

	const { mutate, isPending } = useMutation({
		mutationFn: (payload: CheckoutFormSchemaType) => fetch(`${window.location.origin}/api/profiles/${userId!}`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: { 'Content-type': 'application/json' },
		}).then(async (res) => {
			if (!res.ok) {
				const errorMessage: string = await res.json().then(data => data.error)
				return Promise.reject(new Error(errorMessage))
			}
			return {}
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profileStatus', userId!], exact: true })
			setToastRender({
				active: false,
				message: 'Profile updated successfully'
			})
		},
		onError: (err) => {
			setToastRender({
				active: false,
				message: err.message
			})
		},
	})
	return { mutate, isPending } as { mutate: (payload: CheckoutFormSchemaType) => void, isPending: boolean }
}
