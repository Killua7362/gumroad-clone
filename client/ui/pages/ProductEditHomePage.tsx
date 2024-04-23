import { AllProdctsForUser } from "@/atoms/states";
import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import MDEditor from '@uiw/react-md-editor';
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";

const ProductEditHomePage = () => {
	const [description, setDescription] = useState<string>()
	const [thumbnailImage, setThumbnailImage] = useState<File>()
	const [coverImage, setCoverImage] = useState<File>()
	const allProducts = useRecoilValue(AllProdctsForUser)

	const params = useParams()
	const navigate = useNavigate()

	return (
		<Fragment>
			<div>
				<div className="flex flex-col gap-y-2">
					<div>
						Name
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md">
						<input className="outline-none bg-background text-white w-full text-lg" />
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Summary
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md">
						<input className="outline-none bg-background text-white w-full text-lg" />
					</fieldset>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Description
					</div>
					<MDEditor
						value={description}
						onChange={setDescription}
						preview="edit"
						className='w-full'
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Thumbnail
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex items-center justify-center flex-col gap-y-4">
						{
							thumbnailImage ?
								<img alt="thumbnailImage" width={200} height={200} src={URL.createObjectURL(thumbnailImage)} />
								:
								<div>
									No Image
								</div>
						}
						<label htmlFor='thumbimage' className="p-2 cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] rounded-md overflow-none">Upload...</label>
						<input type="file" id='thumbimage' name='thumnail' accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }} onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setThumbnailImage(e.target.files[0])
							}
						}} />
					</div>
				</div>
				<div className="flex flex-col gap-y-2">
					<div>
						Cover
					</div>
					<div className="border-white/30 border-dashed border-[0.1px] p-10 flex items-center justify-center flex-col gap-y-4">
						{
							coverImage ?
								<img alt="coverImage" width={200} height={200} src={URL.createObjectURL(coverImage)} />
								:
								<div>
									No Image
								</div>
						}
						<label htmlFor='coverImage' className="p-2 cursor-pointer hover:text-white/70 border-white/30 border-[0.1px] rounded-md overflow-none">Upload...</label>
						<input type="file" id='coverImage' name='coverImage' accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }} onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setCoverImage(e.target.files[0])
							}
						}} />
					</div>
				</div>
				<div className="flex flex-col gap-y-3">
					<div>
						Price
					</div>
					<fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
						<input className="  text-lg bg-background text-white outline-none px-4" type="number" step='any' />
					</fieldset>
					<div className="flex gap-x-4">
						<input type="checkbox" className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit" />
						<div className="text-base">
							Allow customers to pay whatever they want
						</div>
					</div>
				</div>
				<div className="flex gap-x-4 w-full justify-end">
					<div className="px-4 py-2 border-white/30 border-[0.1px] rounded-md hover:text-white/70 cursor-pointer">
						Cancel
					</div>
					<div className="px-4 py-2 border-white/30 border-[0.1px] rounded-md hover:text-white/70 cursor-pointer">
						Save
					</div>
				</div>
			</div>
			<div>
				Testing
			</div>
		</Fragment>
	)
}

export default ProductEditHomePage
