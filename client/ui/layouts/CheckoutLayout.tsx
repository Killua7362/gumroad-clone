import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
	const [sortConfig, setSortConfig] = useState<sortConfig>({
		active: false,
		byType: "date",
		reverse: true
	})

	const [searchConfig, setSearchConfig] = useState<searchConfig>({
		active: false
	})

	const params = useParams()

	return (
		<div className="h-full w-full">
			<div className="h-full px-3 sm:mx-10">
				<div className="flex flex-col text-white/90 pb-5 pt-3 sm:pb-0 sm:pt-6 mb-0 gap-y-10">
					<div className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide">
						Checkout
					</div>
					<div className="border-b-[1px] h-3 border-white/30 flex gap-x-4 z-20">
						<Link to='/checkout/form' className={`no-underline ${params.page && params.page === 'form' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'form' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Form
							</span>
						</Link>
						<Link to='/checkout/suggestions' className={`no-underline ${params.page && params.page === 'suggestions' && 'cursor-default pointer-events-none'}`}>
							<span className={`border-white/30 border-[0.1px] rounded-2xl px-3 py-2 w-fit h-fit ${params.page && params.page === 'suggestions' ? 'bg-white text-black' : 'bg-background text-white hover:bg-accent'} `}>
								Suggest
							</span>
						</Link>
					</div>
				</div>
				<div className="w-full flex flex-col gap-6">
					{children}
				</div>
			</div>
		</div >
	)
}
export default CheckoutLayout
