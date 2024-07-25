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

export const allProductsFetcherProps = {
    queryKey: ['allProducts'],
    queryFn: () =>
        fetch(`${window.location.origin}/api/products`).then(async (res) => {
            if (!res.ok) {
                const errorMessage: string = await res
                    .json()
                    .then((data) => data.error);
                return Promise.reject(new Error(errorMessage));
            }
            return res.json().then((data) => {
                const result: ProductTypePayload = {};
                for (let i = 0; i < data.data.length; i++) {
                    result[data.data[i].id] = { ...data.data[i].attributes };
                }
                return result;
            });
        }),
};

interface returnAllProductsFetcher {
    data: ProductTypePayload;
    isSuccess: boolean;
    isPending: boolean;
}

interface allProductsFetcher {
    initialData?: ProductTypePayload | undefined;
}

export const allProductsFetcher = ({
    initialData,
}: allProductsFetcher): returnAllProductsFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...allProductsFetcherProps,
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

export const collabsProductFetcherProps = {
    queryKey: ['collabProducts'],
    queryFn: () =>
        fetch(`${window.location.origin}/api/collabs/products`).then(
            async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json().then((data) => {
                    const result: ProductTypePayload = {};
                    for (let i = 0; i < data.data.length; i++) {
                        result[data.data[i].id] = {
                            ...data.data[i].attributes,
                        };
                    }
                    return result;
                });
            }
        ),
};

interface returnCollabsProductFetcher {
    data: ProductTypePayload;
    isSuccess: boolean;
    isPending: boolean;
}

interface collabsProductFetcher {
    initialData: ProductTypePayload | undefined;
}

export const collabsProductFetcher = ({
    initialData,
}: collabsProductFetcher): returnCollabsProductFetcher => {
    const { data, isSuccess, isPending } = useQuery({
        ...collabsProductFetcherProps,
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
            if (queryClient.getQueryData(['allProducts'])) {
                return (
                    queryClient.getQueryData([
                        'allProducts',
                    ]) as ProductTypePayload
                )[productId!];
            } else {
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
            }
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
                        const result: ProductTypePayload = {};
                        for (let i = 0; i < data.data.length; i++) {
                            result[data.data[i].id] = {
                                ...data.data[i].attributes,
                            };
                        }
                        return result;
                    });
                }
            ),
    };
};

interface returnGetProfileProductFetcher {
    data: ProductTypePayload;
    isSuccess: boolean;
    isPending: boolean;
}

interface getProfileProductsFetcher {
    userId: string | undefined;
    initialData?: ProductTypePayload | undefined;
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
            if (queryClient.getQueryData(['profileProducts', userId!])) {
                return (
                    queryClient.getQueryData([
                        'profileProducts',
                        userId!,
                    ]) as ProductTypePayload
                )[productId!];
            } else {
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
            }
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
