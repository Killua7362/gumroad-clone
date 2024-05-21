interface SideBarProps {
	sideBarOpen: boolean;
	windowWidth: number;
	setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setWindowWidth: React.Dispatch<React.SetStateAction<number>>;
}
