import { useRunner } from 'react-live-runner'
import ProfileHomePage from '@/ui/pages/ProfileHomePage'
import { useState } from 'react'
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from '@/ui/components/button';

const CheckoutForm = () => {

	const code = `
		<div className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProfileHomePage preview={true} name={tempName} bio={tempBio} productCategories={tempProductCategories}/>
		</div>
	`
	const [tempProductCategories, setTempProductCategories] = useState<productCategories[]>([
		{
			name: 'All Products',
			hide: false
		}
	])

	const [tempName, setTempName] = useState<string>("")
	const [tempBio, setTempBio] = useState<string>("")

	const scope = {
		ProfileHomePage,
		tempProductCategories,
		tempName,
		tempBio
	}

	const { element, error } = useRunner({ code, scope })


	return (
		<div className="flex justify-center w-full h-full gap-x-0">
			<div className="w-full xl:w-7/12 xl:h-[50rem] py-10 px-0 xl:px-8 overflow-y-auto bg-background overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background flex flex-col justify-between gap-y-4">
				<div className='flex flex-col gap-y-4'>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Name
						</div>
						<div>
							<input
								className="bg-background border-white/30 border-[0.1px] rounded-md overflow-hidden w-full text-base text-white outline-none focus-within:border-white px-4 py-2" value={tempName} onChange={(e) => {
									e.preventDefault()
									setTempName(e.currentTarget.value)
								}} />
						</div>
					</div>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Bio
						</div>
						<div>
							<input
								className="bg-background border-white/30 border-[0.1px] rounded-md overflow-hidden w-full text-base text-white outline-none focus-within:border-white px-4 py-2"
								value={tempBio}
								onChange={(e) => {
									e.preventDefault()
									setTempBio(e.currentTarget.value)
								}}
							/>
						</div>
					</div>
					<div className='flex flex-col gap-y-4'>
						<div className='text-xl'>
							Products
						</div>
						<div className='flex flex-col gap-y-4'>
							{
								tempProductCategories.map((e, i) => {
									return (
										<div className='gap-x-4 items-center flex'>
											{
												i !== 0 &&
												<div>
													{i}
												</div>

											}
											<input
												className="bg-background border-white/30 border-[0.1px] rounded-md overflow-hidden w-full text-base text-white outline-none focus-within:border-white px-4 py-2" value={e.name} disabled={i !== 0 ? false : true} placeholder={i !== 0 ? `Enter product category name` : `Default`}
												onChange={(e) => {
													e.preventDefault()
													let tempProducts: productCategories[] = [...tempProductCategories];
													tempProducts[i].name = e.currentTarget.value
													setTempProductCategories(tempProducts)
												}}
											/>
											{
												i !== 0 &&
												<div className=' py-2 px-4 border-white/30 border-[0.1px] rounded-xl'>
													Filter
												</div>

											}
											<div className={`${tempProductCategories.length === 1 ? "text-white/70" : "hover:text-white/90 cursor-pointer text-white"} text-base flex gap-x-3 items-center rounded-xl border-white/30 border-[0.1px] px-4 py-2`}
												onClick={() => {
													if (tempProductCategories.length !== 1) {
														let tempProducts: productCategories[] = [...tempProductCategories];
														tempProducts[i].hide = tempProducts[i].hide ? false : true
														setTempProductCategories(tempProducts)
													}
												}}>
												{
													tempProductCategories[i].hide && tempProductCategories.length !== 1 ?
														<span className='flex gap-x-2 items-center'>
															<FaEye />
															Show
														</span>
														:
														<span className='flex gap-x-2 items-center'>
															<FaEyeSlash />
															Hide
														</span>
												}
											</div>
											{
												i !== 0 &&
												<div className='text-white hover:text-white/80 text-base flex gap-x-3 items-center rounded-xl border-white/30 border-[0.1px] px-4 py-2 cursor-pointer'
													onClick={() => {
														let tempProducts: productCategories[] = [...tempProductCategories];
														tempProducts = tempProducts.filter((e, idx) => idx !== i)
														setTempProductCategories(tempProducts)
													}}>
													<RiDeleteBin2Fill className='text-red-400' />
													<span>
														Delete
													</span>
												</div>
											}
										</div>
									)
								})
							}
							<div className='gap-x-4 items-center flex w-full justify-end'>
								<Button buttonName='Add new category' onClickHandler={() => {
									setTempProductCategories(prev => {
										return [...prev, {
											name: '',
											hide: true
										}]
									})
								}}
									extraClasses={['w-full py-4']}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='flex gap-x-4 w-full justify-end'>
					<Button buttonName='Revert' />
					<Button buttonName='Save' />
				</div>
			</div>
			<div className={`w-5/12 h-[50rem] overflow-x-auto overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}
			>
				<div className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
					Preview
				</div>
				{element}
			</div>
		</div >
	)
}

export default CheckoutForm
