import { queryClient } from "@/app/RootPage";
import { allProductsFetcherProps } from "@/react-query/query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ProductHomeSchema = z.object({
	sort_by: z.enum(['title', 'price', 'created_date', 'modified_date']).catch('title').optional(),
	reverse: z.boolean().catch(false).optional(),
	search_word: z.string().optional()
})

export type ProductHomeRouteType = z.infer<typeof ProductHomeSchema>

export const Route = createFileRoute('/_protected/_layout/products/_layout_products/home/')({
	loader: async () => {
		const allProducts = await queryClient.ensureQueryData(allProductsFetcherProps)
		return allProducts as ProductTypePayload
	},
	validateSearch: ProductHomeSchema,
})
