import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const productContentSearchSchema = z.object({
	page: z.number().catch(1).optional()
})

export type ProductContentSearchType = z.infer<typeof productContentSearchSchema>

export const Route = createFileRoute('/_protected/_layout/products/edit/$id/_layout_edit/content/')({
	validateSearch: productContentSearchSchema
})
