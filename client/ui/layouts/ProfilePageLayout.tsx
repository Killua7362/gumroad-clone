import ProfileNavbar from "@/ui/components/profile/navbar"

interface ProfilePageLayoutProps {
	children: React.ReactNode,
	preview?: boolean
}

const ProfilePageLayout = ({ children, preview = false }: ProfilePageLayoutProps) => {
	return (
		<div className="h-full w-full mb-20">
			<ProfileNavbar />
			{children}
		</div>
	)
}

export default ProfilePageLayout
