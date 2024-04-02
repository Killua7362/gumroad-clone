import ProductsDetailsPageLayout from "@/ui/layouts/ProductsDetailsPageLayout"
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { motion } from 'framer-motion'

const ProductsDetailsPage = ({ preview = false }: { preview?: boolean }) => {
	const titleRef = useRef(null)
	const titleIsInView = useInView(titleRef, {
		margin: "-50% 0px 0px 0px"
	})

	useEffect(() => {
		console.log(titleIsInView)
	}, [titleIsInView])

	return (
		<ProductsDetailsPageLayout preview={preview}>
			<motion.div
				transition={{ duration: 0.2 }}
				layout
				className={` w-[100%] flex justify-center items-center bg-background border-b-[0.1px] border-white/30  fixed mt-[0rem] sm:mt-[-4rem] overflow-hidden ${titleIsInView ? "h-[0rem]" : "min-h-[5rem]"} `}>
				<div className="w-10/12 xl:w-8/12 text-xl flex justify-between">
					<span>
						Title of the product
					</span>
					<span>
						10rs
					</span>
				</div>
			</motion.div>
			<div className={`w-full h-full flex flex-col gap-y-3 ${preview ? "pt-[6rem]" : "mt-[10rem] sm:mt-[14rem] md:mt-[10rem]"}`}>
				<div className="w-10/12 xl:w-8/12 mx-auto h-full flex flex-col mt-2 flex flex-col">
					<div className="w-full h-[50rem] bg-accent border-[0.1px] border-white/30">
						Photo
					</div>
					<div className="flex border-[0.1px] border-white/30 divide-x-2 divide-white/30">
						<div className="flex flex-col w-8/12 divide-y-2 divide-white/30">
							<div className="divide-y-2 divide-white/30 flex flex-col" ref={titleRef}>
								<div className="text-3xl p-5">
									Title of the product
								</div>
								<div className="flex text-xl justify-between gap-x-6 divide-x-2 divide-white/30">
									<div className="p-5">
										10rs
									</div>
									<div className="w-full p-5">
										Akshay bhat
									</div>
									<div className="w-full p-5">
										3
									</div>
								</div>
							</div>
							<div className="p-5 text-justify text-lg">
								{`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro molestias hic perferendis dignissimos autem inventore, magnam tempora aut unde ratione itaque, cupiditate similique nisi eligendi beatae quas excepturi eos facere!`.repeat(10)}
							</div>
						</div>
						<div className="w-4/12">
							<div className="flex flex-col gap-y-4 p-8 items-center w-full">
								<span className="w-full text-lg">
									Name a fair price
								</span>
								<div className="flex items-center gap-x-4 w-full border-white/30 border-[0.1px] rounded-xl overflow-hidden p-2 focus-within:border-white">
									<RiMoneyEuroCircleLine className="text-4xl" />
									<input className="bg-background text-white/30 text-lg w-full p-2 outline-none" />
								</div>
								<div className="w-full border-white/30 border-[0.1px] flex flex-col divide-y-[0.1px] divide-white/30 rounded-md">
									<div className="p-4">
										content1
									</div>
									<div className="p-4">
										content1
									</div>
									<div className="p-4 flex justify-between">
										<span>
											Size
										</span>
										<span>
											12 MB
										</span>
									</div>
								</div>
								<div className="p-4 border-white/30 border-[0.1px] rounded-xl text-center w-full text-black bg-white">
									Add to Cart
								</div>
								<div className="p-4 border-white/30 border-[0.1px] rounded-xl text-center w-full text-black bg-white">
									Wishlist
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProductsDetailsPageLayout>
	)
}
export default ProductsDetailsPage
