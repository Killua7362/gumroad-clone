import ProfileCheckoutPageLayout from '@/ui/layouts/ProfileCheckoutPageLayout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/profile/$id/checkout/')({
	component: () => {
		return <ProfileCheckoutPage />
	}
})

const ProfileCheckoutPage = ({ preview = false }: { preview?: boolean }) => {
	return (
		<ProfileCheckoutPageLayout preview={preview}>
			<div>
				testing
			</div>
		</ProfileCheckoutPageLayout>
	)
}
