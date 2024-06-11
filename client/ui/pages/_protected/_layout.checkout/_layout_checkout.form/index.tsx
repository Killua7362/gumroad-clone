import { queryClient } from  '@/app/RouteComponent';
import { getProfileStatusProps } from "@/react-query/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_protected/_layout/checkout/_layout_checkout/form/')({
	loader: async () => {
		const profileDataQuery = getProfileStatusProps({ userId: (queryClient.getQueryData(['loginStatus']) as authSchema).user_id })
		const profileData = await queryClient.ensureQueryData(profileDataQuery)
		return profileData as CheckoutFormSchemaType
	}
})
