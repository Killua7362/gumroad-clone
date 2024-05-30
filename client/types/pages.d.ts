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
