import { queryClient } from '@/app/RouteComponent';
import { hideToastState } from '@/atoms/states';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import _ from 'lodash';
import React from 'react';
import {
    UseFormGetValues,
    UseFormReset,
    UseFormSetError,
} from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

export type signInSchemaType = import('zod').z.infer<
    typeof import('@/forms/schema/auth_schema').signInSchema
>;

export type signUpSchemaType = import('zod').z.infer<
    typeof import('@/forms/schema/auth_schema').signUpSchema
>;

export type EditProductSchemaType = import('zod').z.infer<
    typeof import('@/forms/schema/edit_product_schema').EditProductSchema
>;

export type NewProductSchemaType = import('zod').z.infer<
    typeof import('@/forms/schema/new_product_schema').NewProductSchema
>;

export type CheckoutFormSchemaType = import('zod').z.infer<
    typeof import('@/forms/schema/checkout_schema').CheckoutFormSchema
>;

// adding id to all delete function and modal
interface returnGetProductDeleter {
    mutate: (id: string) => void;
    isPending: boolean;
}

export const getProductDeleter = (): returnGetProductDeleter => {
    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) =>
            fetch(`${window.location.origin}/api/products/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return {};
            }),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({
                queryKey: ['allProducts', id!],
                exact: true,
            });
            return queryClient.invalidateQueries({
                queryKey: ['allProducts'],
                exact: true,
            });
        },
        onError: (err) => {
            console.log(err);
        },
        onSettled: () => {},
    });

    return { mutate, isPending };
};

interface returnGetProductCreater {
    mutate: (payload: ProductType) => void;
    isPending: boolean;
}

export const getProductCreater = (): returnGetProductCreater => {
    const setToastRender = useSetRecoilState(hideToastState);

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: ProductType) =>
            fetch(`${window.location.origin}/api/products`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: ['allProducts'] });
        },
        onError: (err) => {
            setToastRender({
                active: false,
                message: err.message,
            });
        },
    });

    return { mutate, isPending };
};

interface returnSetLogOut {
    mutate: () => void;
    isPending: boolean;
}

export const setLogOut = (): returnSetLogOut => {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            fetch(`${window.location.origin}/api/sessions/logout`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: () => {
            navigate({ to: '/signin' });
            return queryClient.clear();
        },
        onError: (err) => {},
    });

    return { mutate, isPending };
};
interface returnGetCollabApprover {
    mutate: (key: string) => void;
    isPending: boolean;
}

export const getCollabApprover = (): returnGetCollabApprover => {
    const { mutate, isPending } = useMutation({
        mutationFn: (key: string) =>
            fetch(`${window.location.origin}/api/collabs/${key}/approve`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({}),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: ['collabProducts'],
            });
        },
        onError: (err) => {},
    });

    return { mutate, isPending };
};

interface returnGetProductEditor {
    mutateAsync: ({
        payload,
        id,
    }: {
        payload: ProductType;
        id: string;
    }) => Promise<ProductType>;
    isPending: boolean;
    isSuccess: boolean;
}

interface getProductEditor {
    setError: UseFormSetError<EditProductSchemaType>;
    reset: UseFormReset<EditProductSchemaType>;
    getValues: UseFormGetValues<EditProductSchemaType>;
}

export const getProductEditor = ({
    setError,
    reset,
    getValues,
}: getProductEditor): returnGetProductEditor => {
    const setToastRender = useSetRecoilState(hideToastState);

    const {
        mutateAsync: productSet,
        isPending: productIsSetting,
        isSuccess: productSettingSuccess,
    } = useMutation({
        mutationFn: ({ payload, id }: { payload: ProductType; id: string }) =>
            fetch(`${window.location.origin}/api/products/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: (data, { payload, id }) => {
            setToastRender({
                active: false,
                message: 'Product updated successfully',
            });
            queryClient.invalidateQueries({
                queryKey: ['allProducts', id!],
                exact: true,
            });
            return queryClient.invalidateQueries({
                queryKey: ['allProducts'],
                exact: true,
            });
        },
        onError: (err) => {
            return Promise.reject(err);
        },
    });

    const {
        mutateAsync,
        isPending: productCollabValidating,
        isSuccess: productCollabSuccess,
    } = useMutation({
        mutationFn: ({ payload, id }: { payload: ProductType; id: string }) =>
            fetch(`${window.location.origin}/api/collabs/validate_user`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    collabs: [...payload.collabs!].map((e) => e.email),
                }),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: async (data, { payload, id }) => {
            if (data.valid) {
                try {
                    await productSet({ payload: { ...payload }, id });
                    reset(
                        _.pick(
                            {
                                ...payload,
                            },
                            Object.keys(getValues())
                        )
                    );
                    queryClient.invalidateQueries({
                        queryKey: ['allProducts', id!],
                    });
                } catch (err) {
                    setToastRender({ active: false, message: err.message });
                }
            } else {
                (data.data || []).map((e: string, index: number) => {
                    e &&
                        setError(`collabs.${index}.email`, {
                            type: `collabs.${index}.email`,
                            message: e,
                        });
                });
            }
        },
        onError: (error) => {
            setToastRender({ active: false, message: error.message });
        },
    });
    const isPending: boolean = productIsSetting || productCollabValidating;
    const isSuccess: boolean = productSettingSuccess && productCollabSuccess;
    return { mutateAsync, isPending, isSuccess };
};

interface returnGetProductLiveToggle {
    mutate: (payload: { key: string; live: boolean }) => void;
    isPending: boolean;
}

export const getProductLiveToggle = (): returnGetProductLiveToggle => {
    const setToastRender = useSetRecoilState(hideToastState);

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: { key: string; live: boolean }) =>
            fetch(`${window.location.origin}/api/products/${payload.key}`, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify({ live: payload.live }),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: (data, payload) => {
            queryClient.invalidateQueries({
                queryKey: ['allProducts', payload.key!],
                exact: true,
            });
            return queryClient.invalidateQueries({
                queryKey: ['allProducts'],
                exact: true,
            });
        },
        onError: (err) => {
            setToastRender({
                active: false,
                message: err.message,
            });
        },
    });

    return { mutate, isPending };
};

interface returnSetLoginStatus {
    mutate: (payload: signInSchemaType) => void;
    isPending: boolean;
}

interface setLoginStatus {
    setCustomError: React.Dispatch<React.SetStateAction<string>>;
}
export const setLoginStatus = ({
    setCustomError,
}: setLoginStatus): returnSetLoginStatus => {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: signInSchemaType) =>
            fetch(`${window.location.origin}/api/sessions`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return res.json();
            }),
        onSuccess: () => {
            navigate({ to: '/home' });
            return queryClient.clear();
        },
        onError: (err) => {
            setCustomError(err.message);
        },
    });
    return { mutate, isPending };
};

interface returnSetSignUp {
    mutate: (payload: signUpSchemaType) => void;
    isPending: boolean;
}
interface setSignUp {
    setCustomError: React.Dispatch<React.SetStateAction<string>>;
}
export const setSignUp = ({ setCustomError }: setSignUp): returnSetSignUp => {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: signUpSchemaType) =>
            fetch(`${window.location.origin}/api/registrations`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return {};
            }),
        onSuccess: () => {
            navigate({ to: '/signin' });
        },
        onError: (err) => {
            setCustomError(err.message);
        },
    });

    return { mutate, isPending };
};

interface returnGetProfileStatusSetter {
    mutate: (payload: CheckoutFormSchemaType) => void;
    isPending: boolean;
}
interface getProfileStatusSetter {
    userId: string;
}

export const getProfileStatusSetter = ({
    userId,
}: getProfileStatusSetter): returnGetProfileStatusSetter => {
    const setToastRender = useSetRecoilState(hideToastState);

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CheckoutFormSchemaType) =>
            fetch(`${window.location.origin}/api/profiles/${userId!}`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(payload),
                headers: { 'Content-type': 'application/json' },
            }).then(async (res) => {
                if (!res.ok) {
                    const errorMessage: string = await res
                        .json()
                        .then((data) => data.error);
                    return Promise.reject(new Error(errorMessage));
                }
                return {};
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profileStatus', userId!],
                exact: true,
            });
            setToastRender({
                active: false,
                message: 'Profile updated successfully',
            });
        },
        onError: (err) => {
            setToastRender({
                active: false,
                message: err.message,
            });
        },
    });
    return { mutate, isPending };
};
