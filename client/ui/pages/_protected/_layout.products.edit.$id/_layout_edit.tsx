import { queryClient } from '@/app/RouteComponent';
import { hideToastState } from '@/atoms/states';
import { getEditProductFormProps } from '@/forms';
import {
    EditProductSchemaType,
    getProductEditor,
} from '@/react-query/mutations';
import {
    singleProductFetcher,
    singleProductFetcherProps,
} from '@/react-query/query';
import Button from '@/ui/components/button';
import Loader from '@/ui/components/loader';
import NavigationBlocker from '@/ui/components/modal/NavigationBlocker';
import {
    Block,
    Link,
    Outlet,
    createFileRoute,
    useMatchRoute,
    useRouterState,
} from '@tanstack/react-router';
import _ from 'lodash';
import { createContext, useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { ProductContentSearchType } from './_layout_edit.content';

export const productEditContext =
    createContext<ReactFormProps<EditProductSchemaType> | null>(null);

export const Route = createFileRoute(
    '/_protected/_layout/products/edit/$id/_layout_edit'
)({
    loader: async ({ params }): Promise<ProductType> => {
        const singleProductDataQuery = singleProductFetcherProps({
            productId: params.id,
        });
        const singleProductData = await queryClient.ensureQueryData(
            singleProductDataQuery
        );
        return singleProductData;
    },
    component: ({ singleProductData }) => {
        return (
            <ProductEditPageLayout>
                <Outlet />
            </ProductEditPageLayout>
        );
    },
});

const ProductEditPageLayout = ({ children }: { children: React.ReactNode }) => {
    const setToastRender = useSetRecoilState(hideToastState);

    const matchRoute = useMatchRoute();

    const params = Route.useParams();

    const initialData = Route.useLoaderData();

    const {
        data: currentProduct,
        isPending: productsIsLoading,
        isSuccess: productIsSuccess,
    } = singleProductFetcher({ productId: params.id, initialData });

    if (productsIsLoading) return <Loader />;

    if (productIsSuccess) {
        const productEditProps = getEditProductFormProps({ ...currentProduct });
        const {
            reset,
            setError,
            handleSubmit,
            errors,
            trigger,
            control,
            watch,
            getValues,
        } = productEditProps!;
        const { isDirty } = useFormState({ control });

        const {
            mutateAsync: collabChecker,
            isPending: productIsLoading,
            isSuccess,
        } = getProductEditor({ setError, reset, getValues });
        const routerState = useRouterState();

        const [rendered, setRendered] = useState(false);
        useEffect(() => {
            if (routerState.location.state) {
                const stateData: ProductType = {
                    ...(queryClient.getQueryData([
                        'allProducts',
                        params.id!,
                    ]) as ProductType),
                    ...routerState.location.state,
                };
                reset(_.pick(stateData, Object.keys(getValues())), {
                    keepDefaultValues: true,
                });
            }
            setRendered(true);
        }, []);

        return (
            rendered && (
                <Block condition={isDirty}>
                    {({
                        status,
                        proceed,
                        reset: blockReset,
                    }: {
                        status: 'idle' | 'blocked';
                        proceed: () => void;
                        reset: () => void;
                    }) => (
                        <div className="mx-auto sm:px-6 lg:px-8">
                            {status === 'blocked' && (
                                <NavigationBlocker
                                    listeners={false}
                                    proceed={proceed}
                                    reset={blockReset}
                                />
                            )}
                            <productEditContext.Provider
                                value={productEditProps}>
                                <header className="pt-4 py-8 sm:pt-8 border-b border-white/10 px-4 sm:px-0">
                                    <nav className="flex justify-between">
                                        <section className="grid">
                                            <h1
                                                className={`${isDirty ? 'text-red-400' : 'text-white'} text-4xl font-bold mb-6`}>
                                                {watch('title') || 'Untitled'}
                                            </h1>
                                            <section className="flex space-x-4">
                                                <Link
                                                    to="/products/edit/$id/home"
                                                    params={{ id: params.id }}
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                    state={{
                                                        ...getValues(),
                                                    }}
                                                    className={`  ${location.pathname === `/products/edit/${params.id}/home` ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                                                    Home
                                                </Link>
                                                <Link
                                                    to="/products/edit/$id/content"
                                                    params={{ id: params.id }}
                                                    search={(
                                                        prev: ProductContentSearchType
                                                    ) => ({
                                                        page: 1,
                                                        ...prev,
                                                    })}
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                    state={{
                                                        ...getValues(),
                                                    }}
                                                    className={`  ${location.pathname === `/products/edit/${params.id}/content` ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                                                    Content
                                                </Link>
                                            </section>
                                        </section>
                                        <section className="grid gap-y-3">
                                            <ul className="flex gap-x-4 list-none">
                                                <li>
                                                    <Button
                                                        buttonName="Revert"
                                                        extraClasses={[
                                                            '!text-lg !rounded-xl',
                                                        ]}
                                                        onClickHandler={() => {
                                                            reset();
                                                        }}
                                                    />
                                                </li>
                                                <li>
                                                    <Button
                                                        buttonName="Save"
                                                        isLoading={
                                                            productIsLoading
                                                        }
                                                        extraClasses={[
                                                            '!text-lg !rounded-xl',
                                                        ]}
                                                        type="submit"
                                                        formID="edit_product_form"
                                                        onClickHandler={async () => {
                                                            const result =
                                                                await trigger();
                                                            if (!result) {
                                                                setToastRender({
                                                                    active: false,
                                                                    message:
                                                                        'Error occured for some fields',
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </li>
                                            </ul>
                                        </section>
                                    </nav>
                                </header>
                                <form
                                    className="text-xl flex flex-col lg:flex-row gap-4 relative left-0 top-4"
                                    id="edit_product_form"
                                    onSubmit={handleSubmit(async (data) => {
                                        if (isDirty) {
                                            await collabChecker({
                                                payload: {
                                                    ...(queryClient.getQueryData(
                                                        [
                                                            'allProducts',
                                                            params.id!,
                                                        ]
                                                    ) as ProductType),
                                                    ...data,
                                                },
                                                id: params.id!,
                                            });
                                        } else {
                                            setToastRender({
                                                active: false,
                                                message: 'No changes detected',
                                            });
                                        }
                                    })}>
                                    {children}
                                </form>
                            </productEditContext.Provider>
                        </div>
                    )}
                </Block>
            )
        );
    }
};
