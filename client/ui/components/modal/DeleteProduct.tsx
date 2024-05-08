import { modalBaseActive, productsCardContextMenu } from "@/atoms/states"
import { useRecoilValue, useSetRecoilState } from "recoil"
import Button from "@/ui/components/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const DeleteProduct = () => {
	const queryClient = useQueryClient()
	const setModalActive = useSetRecoilState(modalBaseActive)
	const contextMenuValue = useRecoilValue(productsCardContextMenu)

	const { mutate: productDeleter } = useMutation({
		mutationFn: () => fetch(`${window.location.origin}/api/products/${contextMenuValue.id}`, {
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
			return queryClient.invalidateQueries({ queryKey: ['allProducts'] })
		},
		onError: (err) => {

		},
		onSettled: () => {
			setModalActive({
				active: false,
				type: ""
			})

		}
	})
	return (
		<div className="bg-background border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
			<div className="text-xl">
				Confirm Delete?
			</div>
			<div className="flex gap-x-4">
				<Button buttonName="Cancel" type="button" onClickHandler={() => {
					setModalActive({
						active: false,
						type: ""
					})
				}}
				/>
				<Button buttonName="Confirm" type="button" onClickHandler={() => { productDeleter() }} extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
			</div>
		</div>
	)
}

export default DeleteProduct
