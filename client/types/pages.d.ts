
interface SideBarProps {
	sideBarOpen: boolean;
	windowWidth: number;
	setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setWindowWidth: React.Dispatch<React.SetStateAction<number>>;
}

interface ProfilePageCardProps {
	name: string;
	url: string;
	profileProducts: Entries<ProductTypePayload>;
}

interface RootContextProps {
	sidebaractive: boolean;
}

interface SideBarCardProps {
	title: string;
	sideBarProps: SideBarProps;
	icon: React.ReactNode;
	isOpen: boolean;
	extraClasses?: string;
	closeSideBar?: boolean;
	onClickHandler?: () => void;
	windowWidth: number;
	disableLink?: boolean;
}
