import { queryClient } from '@/app/RouteComponent';
import { collabsProductFetcherProps } from '@/react-query/query';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const productPageCollaboratorsSchema = z.object({
    type: z.enum(['incoming', 'outgoing'] as const).catch('incoming'),
});

export type productPageCollaboratorsSchemaType = z.infer<
    typeof productPageCollaboratorsSchema
>;

interface returnProductPageCollaborators {
    collabProducts: ProductType[];
}

export const Route = createFileRoute(
    '/_protected/_layout/products/_layout_products/collaborators/'
)({
    loaderDeps: ({ search: { type } }) => ({ type }),
    loader: async ({
        deps: { type },
    }): Promise<returnProductPageCollaborators> => {
        const collabProducts = await queryClient.ensureQueryData(
            collabsProductFetcherProps({ type })
        );

        return {
            collabProducts,
        };
    },
    validateSearch: productPageCollaboratorsSchema,
});
