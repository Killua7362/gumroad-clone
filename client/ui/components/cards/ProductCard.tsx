import { FaDotCircle } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { GoLink } from "react-icons/go";

const ProductCard = ({ children, productData }: { children: React.ReactNode, productData: ProductType }) => {
	return (
		<div className="flex flex-col sm:flex-row gap-y-4 gap-x-6 sm:items-center border-white/30 border-[0.1px] rounded-xl p-6 relative">
			<div>
				{
					productData?.thumbimageSource && productData?.thumbimageSource !== '' ?
						<img src={productData.thumbimageSource!} height={0} width={0} alt='image' className="sm:h-[4rem] sm:w-[4rem] h-[3rem] w-[3rem]" />
						:
						<div className="text-[3rem] sm:text-[4rem]">
							<FaImage />
						</div>
				}
			</div>
			<div className="flex flex-col gap-y-2">
				<div className="text-2xl tracking-wider flex gap-x-2 items-center">
					<span>
						{productData.title}
					</span>
					<span className="text-lg text-sky-400">
						<GoLink />
					</span>
				</div>
				<div className="text-white/70 text-lg tracking-wide font-thin text-justify">
					tldr; This is the best product you can buy
				</div>
				<div className="flex gap-x-3">
					{productData.type !== "" && productData.type.split(' ').map((e, i) => {
						return (
							<div className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl">
								Type
							</div>
						)
					})}
				</div>
				<div className="flex gap-x-6 mt-1">
					<div className={`${productData.live ? "text-green-400" : "text-red-400"}  flex items-center gap-x-1`}>
						<div className="text-sm relative top-[0.1rem]">
							<FaDotCircle />
						</div>
						<div>
							Live
						</div>
					</div>
				</div>
			</div>
			{children}
		</div>
	)
}

export default ProductCard