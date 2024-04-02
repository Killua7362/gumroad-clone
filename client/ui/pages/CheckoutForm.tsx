import { useRunner } from 'react-live-runner'
import ProfileHomePage from '@/ui/pages/ProfileHomePage'

const CheckoutForm = () => {

	const code = `
		<div className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProfileHomePage preview={true}/>
		</div>
	`

	const scope = {
		ProfileHomePage
	}

	const { element, error } = useRunner({ code, scope })

	return (
		<div className="flex justify-center w-full h-full gap-x-0">
			<div className="w-full xl:w-7/12 xl:h-[50rem] py-8 px-0 xl:px-8 overflow-y-auto bg-background overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background">
			</div>
			<div className="w-5/12 h-[50rem] overflow-x-auto overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]">
				<div className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
					Preview
				</div>
				{element}
			</div>
		</div>
	)
}

export default CheckoutForm
