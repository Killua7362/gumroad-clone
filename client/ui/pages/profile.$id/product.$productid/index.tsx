import { queryClient } from "@/app/RootPage";
import { getSingleProfileProductFetcherProps } from "@/react-query/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/profile/$id/product/$productid/')({
loader: async ({ params }) => {
					const singleProfileProductDataQuery = getSingleProfileProductFetcherProps({ userId: params.id, productId: params.productid })

					const singleProductData = await queryClient.ensureQueryData(singleProfileProductDataQuery)

					return {
						singleProductData,
					} as {
						singleProductData: ProductType,
					}
				},
})