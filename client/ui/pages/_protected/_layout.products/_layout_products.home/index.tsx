import { queryClient } from '@/app/RouteComponent';
import { allProductsFetcherProps } from '@/react-query/query';
import { createFileRoute, defer } from '@tanstack/react-router';
import { z } from 'zod';

const ProductHomeSchema = z.object({
    sort_by: z
        .enum(['title', 'price', 'created_at', 'updated_at'])
        .catch('title')
        .optional(),
    reverse: z.boolean().catch(false).optional(),
    search_word: z.string().optional(),
    search_bar_active: z.boolean().catch(false).optional(),
    sort_bar_active: z.boolean().catch(false).optional(),
});

export type ProductHomeRouteType = z.infer<typeof ProductHomeSchema>;

type ProductHomeRouteReturnType = Promise<{
    initialData: Promise<ProductType[]>;
}>;

export const Route = createFileRoute(
    '/_protected/_layout/products/_layout_products/home/'
)({
    loaderDeps: ({ search: { reverse, sort_by, search_word } }) => ({
        reverse,
        sort_by,
        search_word,
    }),
    loader: async ({
        deps: { reverse, sort_by, search_word },
    }): ProductHomeRouteReturnType => {
        const allProducts = queryClient.ensureQueryData(
            allProductsFetcherProps({
                reverse: reverse ?? false,
                sort_by: sort_by ?? 'updated_at',
                search_word: search_word ?? '',
            })
        );
        return {
            initialData: defer(allProducts),
        };
    },
    validateSearch: ProductHomeSchema,
});
