import ProfileCheckoutPageLayout from "@/ui/layouts/ProfileCheckoutPageLayout"

const ProfileCheckoutPage = ({ preview = false }: { preview?: boolean }) => {
	return (
		<ProfileCheckoutPageLayout preview={preview}>
			<div>
				testing
			</div>
		</ProfileCheckoutPageLayout>
	)
}
export default ProfileCheckoutPage
