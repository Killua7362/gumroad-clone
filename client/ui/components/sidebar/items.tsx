import { BsFillBackpack4Fill } from "react-icons/bs";
import { IoBagRemove } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { SiAboutdotme } from "react-icons/si";
import { CgLogOut } from "react-icons/cg";

export const SideBarTopItems = [
	{
		title: "Home",
		icon: <BsFillBackpack4Fill />,
		linkUrl: "/"
	},
	{
		title: "Products",
		icon: <IoBagRemove />,
		linkUrl: "/products/home"
	},
	{
		title: "Checkout",
		icon: <IoMdCart />,
		linkUrl: "/checkout/form"
	},
]

