import { BsFillBackpack4Fill } from "react-icons/bs";
import { IoBagRemove } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";

export const SideBarItems = [
	{
		title: "Home",
		icon: <BsFillBackpack4Fill />,
		onClickHandler: () => { }
	},
	{
		title: "Products",
		icon: <IoBagRemove />,
		onClickHandler: () => { }
	},
	{
		title: "Collaborators",
		icon: <FaHandshake />,
		onClickHandler: () => { }
	},
	{
		title: "Checkout",
		icon: <IoMdCart />,
		onClickHandler: () => { }
	},
]
