import { GoLink } from "react-icons/go"
import CollabCard from "@/ui/components/cards/CollabCard"
import { Fragment } from "react/jsx-runtime"
import { AnimatePresence, motion } from "framer-motion"
import { useRecoilState } from "recoil"
import { productsCardContextMenu } from "@/atoms/states"
import { useEffect } from "react"
import { IoMdSettings } from "react-icons/io";

const CollaboratorsPage = () => {
	const [contextMenuConfig, setContextMenuConfig] = useRecoilState(productsCardContextMenu)

	useEffect(() => {
		const closeContextMenu = () => {
			setContextMenuConfig({
				active: false,
				activeIdx: 0
			})
		}
		document.body.addEventListener('click', closeContextMenu)
		return () => document.body.removeEventListener('click', closeContextMenu)
	}, [])

	return (
		<Fragment>
			{
				new Array(10).fill(0).map((ele, i) => {
					return (
						<CollabCard>
							<Fragment>
								<div className="absolute right-[1rem] top-[1rem] text-xl cursor-pointer hover:text-white/70 " onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()

									contextMenuConfig.active ? setContextMenuConfig({
										active: false,
										activeIdx: i
									}) :
										setContextMenuConfig({
											active: true,
											activeIdx: i
										})
								}}>
									<IoMdSettings/>
								</div>
								<AnimatePresence>
									{
										contextMenuConfig.active && contextMenuConfig.activeIdx === i &&
										<motion.div
											initial={{
												height: 0,
												opacity: 0,
											}}
											animate={{
												height: contextMenuConfig.active ? 'fit-content' : 0,
												opacity: contextMenuConfig.active ? 1 : 0,
												transition: {
													duration: 0.2
												}
											}}
											exit={{
												height: 0,
												opacity: 0,
											}}
											className="flex min-w-[10rem] overflow-hidden bg-background flex-col border-white/30 border-[0.1px] absolute rounded-md right-[1.5rem] top-[2.5rem] "
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
											}}>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer">Renatme</div>
											<div className="px-4 py-3 hover:bg-accent/50 cursor-pointer">Renatme</div>
										</motion.div>
									}
								</AnimatePresence>
							</Fragment>
						</CollabCard>
					)
				})
			}
		</Fragment>
	)
}

export default CollaboratorsPage
