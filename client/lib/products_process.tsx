const sortFunction = (
    [keyA, valueA]: [keyA: string, valueA: ProductType],
    [keyB, valueB]: [keyB: string, valueB: ProductType],
    searchParams: URLSearchParams
) => {
    switch (searchParams.get('sort_by')) {
        case 'title':
            return (valueA.title as any) - (valueB.title as any);
        case 'price':
            return valueA.price - valueB.price;
        case 'created_date':
            return valueA.created_at!.localeCompare(valueB.created_at!);
        default:
            return valueA.updated_at!.localeCompare(valueB.updated_at!);
    }
};

const searchFunction = ({
    products,
    searchParams,
}: {
    products: Entries<ProductTypePayload>;
    searchParams: URLSearchParams;
}) => {
    return products.filter(([key, value], id) =>
        value.title
            .toLowerCase()
            .includes(searchParams.get('search_word') || '')
    );
};

export const processProducts = ({
    products,
    searchURL,
}: {
    products: Entries<ProductTypePayload>;
    searchURL: string;
}) => {
    const searchParams = new URLSearchParams(searchURL);

    let result = searchFunction({ products, searchParams });
    result = result.sort((a, b) => {
        return (
            sortFunction(a, b, searchParams) *
            (searchParams.get('reverse') === 'true' ? -1 : 1)
        );
    });
    if (
        searchParams.get('product_all') !== 'false' ||
        !searchParams.has('product_count')
    ) {
        return result;
    }

    return result.slice(0, Number(searchParams.get('product_count')) || 5);
};
