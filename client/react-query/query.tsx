import { queryClient } from '@/app/RouteComponent';
import { useQuery } from '@tanstack/react-query';
import { CheckoutFormSchemaType } from './mutations';

interface returnLoginStatusFetcher {
    data: authSchema;
    isSuccess: boolean;
    isPending: boolean;
}

export const loginStatusFetcherProps = () => {
    return {
        queryKey: ['loginStatus'],
        queryFn: () =>
            fetch(`${window.location.origin}/api/sessions/logged_in`).then(
                async (res) => {
                    return res.json();
                }
            ),
    };
};
export const loginStatusFetcher = (): returnLoginStatusFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...loginStatusFetcherProps(),
        meta: {
            persist: false,
        },
    });

    return { data, isSuccess, isPending };
};

interface allProductsFetcherProps {
    reverse: boolean | undefined;
    sort_by: 'title' | 'price' | 'created_at' | 'updated_at' | undefined;
    search_word: string;
}
export const allProductsFetcherProps = ({
    reverse,
    sort_by,
    search_word,
}: allProductsFetcherProps) => {
    return {
        queryKey: ['allProducts', sort_by, reverse, search_word],
        queryFn: () =>
            fetch(
                `${window.location.origin}/api/products?sort_by=${sort_by}&reverse=${reverse}&search_word=${search_word}`
            ).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json().then((data) => {
                    const result: ProductType[] = [];
                    for (let i = 0; i < data.data.length; i++) {
                        result[i] = {
                            ...data.data[i].attributes,
                            product_id: data.data[i].id,
                        };
                    }
                    return result;
                });
            }),
    };
};

interface returnAllProductsFetcher {
    data: ProductType[];
    isSuccess: boolean;
    isPending: boolean;
}

interface allProductsFetcher extends allProductsFetcherProps {
    initialData?: ProductType[] | undefined;
}

export const allProductsFetcher = ({
    initialData,
    reverse,
    sort_by,
    search_word,
}: allProductsFetcher): returnAllProductsFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...allProductsFetcherProps({ reverse, sort_by, search_word }),
        meta: {
            persist: false,
        },
        enabled: !!(
            queryClient.getQueryData(['loginStatus']) &&
            (queryClient.getQueryData(['loginStatus']) as authSchema)
                .logged_in == true
        ),
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};

interface collabsProductFetcherProps {
    type: 'incoming' | 'outgoing' | undefined;
}
export const collabsProductFetcherProps = ({
    type,
}: collabsProductFetcherProps) => {
    return {
        queryKey: ['collabProducts', type],
        queryFn: () =>
            fetch(
                `${window.location.origin}/api/collabs/products?type=${type}`
            ).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json().then((data) => {
                    const result: ProductType[] = [];
                    for (let i = 0; i < data.data.length; i++) {
                        result[i] = {
                            ...data.data[i].attributes,
                            product_id: data.data[i].id,
                        };
                    }
                    return result;
                });
            }),
    };
};

interface returnCollabsProductFetcher {
    data: ProductType[];
    isSuccess: boolean;
    isPending: boolean;
}

interface collabsProductFetcher extends collabsProductFetcherProps {
    initialData: ProductType[] | undefined;
}

export const collabsProductFetcher = ({
    initialData,
    type,
}: collabsProductFetcher): returnCollabsProductFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...collabsProductFetcherProps({ type }),
        meta: {
            persist: false,
        },
        enabled: !!(
            queryClient.getQueryData(['loginStatus']) &&
            (queryClient.getQueryData(['loginStatus']) as authSchema)
                .logged_in == true
        ),
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};

export const singleProductFetcherProps = ({
    productId,
}: {
    productId: string | undefined;
}) => {
    return {
        queryKey: ['allProducts', productId!],
        queryFn: () => {
            return fetch(
                `${window.location.origin}/api/products/${productId!}`
            ).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json().then((data) => {
                    const { id, ...temp } = {
                        ...data.data.attributes,
                        id: '',
                    };
                    return temp;
                });
            });
        },
    };
};

interface returnSingleProductFetcher {
    data: ProductType;
    isSuccess: boolean;
    isPending: boolean;
}

interface singleProductFetcher {
    productId: string | undefined;
    initialData?: ProductType | undefined;
}

export const singleProductFetcher = ({
    productId,
    initialData,
}: singleProductFetcher): returnSingleProductFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...singleProductFetcherProps({ productId }),
        meta: {
            persist: false,
        },
        enabled: !!productId,
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};

interface getProfileProductsFetcherProps {
    userId: string | undefined;
}

export const getProfileProductsFetcherProps = ({
    userId,
}: getProfileProductsFetcherProps) => {
    return {
        queryKey: ['profileProducts', userId!],
        queryFn: () =>
            fetch(`${window.location.origin}/api/profiles/${userId!}`).then(
                async (res) => {
                    if (!res.ok) {
                        const errorMessage: string = await res
                            .json()
                            .then((data) => data.error);
                        return Promise.reject(new Error(errorMessage));
                    }
                    return res.json().then((data) => {
                        const result: ProductType[] = [];
                        for (let i = 0; i < data.data.length; i++) {
                            result[i] = {
                                ...data.data[i].attributes,
                                product_id: data.data[i].id,
                            };
                        }
                        return result;
                    });
                }
            ),
    };
};

interface returnGetProfileProductFetcher {
    data: ProductType[];
    isSuccess: boolean;
    isPending: boolean;
}

interface getProfileProductsFetcher {
    userId: string | undefined;
    initialData?: ProductType[] | undefined;
}

export const getProfileProductsFetcher = ({
    userId,
    initialData,
}: getProfileProductsFetcher): returnGetProfileProductFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...getProfileProductsFetcherProps({ userId }),
        meta: {
            persist: false,
        },
        enabled: !!userId,
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};

interface getSingleProfileProductFetcherProps {
    userId: string | undefined;
    productId: string | undefined;
}
export const getSingleProfileProductFetcherProps = ({
    userId,
    productId,
}: getSingleProfileProductFetcherProps) => {
    return {
        queryKey: ['profileProducts', userId!, productId!],
        queryFn: () => {
            return fetch(
                `${window.location.origin}/api/profiles/${userId!}/${productId!}`
            ).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json().then((data): ProductType => {
                    return { ...data.data.attributes };
                });
            });
        },
    };
};

interface returnGetSingleProfileProductFetcher {
    data: ProductType;
    isSuccess: boolean;
    isPending: boolean;
}

interface getSingleProfileProductFetcher {
    userId: string | undefined;
    productId: string | undefined;
    preview: boolean;
    initialData?: ProductType | undefined;
}

export const getSingleProfileProductFetcher = ({
    userId,
    productId,
    preview,
    initialData,
}: getSingleProfileProductFetcher): returnGetSingleProfileProductFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...getSingleProfileProductFetcherProps({ userId, productId }),
        meta: {
            persist: false,
        },
        enabled: !!userId && !!productId && !preview,
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};

interface getProfileStatusProps {
    userId: string | undefined;
}
export const getProfileStatusProps = ({ userId }: getProfileStatusProps) => {
    return {
        queryKey: ['profileStatus', userId!],
        queryFn: () =>
            fetch(`${window.location.origin}/api/profile/${userId!}`).then(
                async (res) => {
                    if (!res.ok) {
                        const errorMessage: string = await res
                            .json()
                            .then((data) => data.error);
                        return Promise.reject(new Error(errorMessage));
                    }
                    return res.json().then((data): CheckoutFormSchemaType => {
                        return { ...data.data.attributes };
                    });
                }
            ),
    };
};

interface getProfileStatus {
    userId: string | undefined;
    preview: boolean;
    initialData?: CheckoutFormSchemaType | undefined;
}

interface returnGetProfileStatus {
    data: CheckoutFormSchemaType;
    isSuccess: boolean;
    isPending: boolean;
}

export const getProfileStatus = ({
    userId,
    preview,
    initialData,
}: getProfileStatus): returnGetProfileStatus => {
    const { data, isSuccess, isPending } = useQuery({
        ...getProfileStatusProps({ userId }),
        meta: {
            persist: false,
        },
        enabled: !!userId && !preview,
        initialData,
    });

    return { data: data!, isSuccess, isPending };
};
