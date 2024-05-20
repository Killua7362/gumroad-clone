import { modalBaseActive } from "@/atoms/states"
import Button from "@/ui/components/button"
import { useSetRecoilState } from "recoil"

const DeletePagesContent = () => {
	const setModalActive = useSetRecoilState(modalBaseActive)

	return (
		<div className="bg-background border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
			<div className="text-xl">
				Confirm Delete?
			</div>
			<div className="flex gap-x-4">
				<Button
					buttonName="Cancel"
					type="button" onClickHandler={() => {
						setModalActive({
							active: false,
							type: ""
						})
					}}
				/>
				<Button buttonName="Confirm"
					isLoading={true}
					type="button"
					onClickHandler={() => {
					}}
					extraClasses={['!border-red-500/70 !text-red-500 hover:text-red-500/70']} />
			</div>
		</div>
	)
}

export default DeletePagesContent
