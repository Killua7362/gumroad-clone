import { hideToastState } from '@/atoms/states';
import { EditProductSchema } from '@/forms/schema/edit_product_schema';
import { filterTypeOptions } from '@/forms/schema/misc_schema';
import { processProducts } from '@/lib/products_process';
import { getProductLiveToggle } from '@/react-query/mutations';
import { allProductsFetcher } from '@/react-query/query';
import Button from '@/ui/components/button';
import ProductCard from '@/ui/components/cards/ProductCard';
import Loader from '@/ui/components/loader';
import DeleteProductModal from '@/ui/components/modal/DeleteProductModal';
import NewProductModal from '@/ui/components/modal/NewProductModal';
import { SelectComponent } from '@/ui/components/select';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaArrowDownWideShort, FaArrowUpShortWide } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { useSetRecoilState } from 'recoil';
import { z } from 'zod';

export const Route = createLazyFileRoute(
    '/_protected/_layout/products/_layout_products/home/'
)({
    component: () => {
        return <ProductsHomePage />;
    },
});

export interface ProductsCardContextMenu {
    active: boolean;
    activeIdx: number;
}

const ProductsHomePage = () => {
    const initialData = Route.useLoaderData();

    const {
        data: allProducts,
        isSuccess: productIsSuccess,
        isPending: productsIsLoading,
    } = allProductsFetcher({ initialData });

    if (productsIsLoading) return <Loader />;

    const [contextMenuConfig, setContextMenuConfig] =
        useState<ProductsCardContextMenu>({
            active: false,
            activeIdx: -1,
        });

    const setToastRender = useSetRecoilState(hideToastState);
    const navigate = Route.useNavigate();
    const params = Route.useSearch();

    const debounceSearchInput = _.debounce((value: string) => {
        navigate({
            search: () => ({ ...params, search_word: value }),
        });
    }, 300);

    useEffect(() => {
        const closeContextMenu = () => {
            setContextMenuConfig({
                active: false,
                activeIdx: 0,
            });
        };
        document.body.addEventListener('click', closeContextMenu);
        return () =>
            document.body.removeEventListener('click', closeContextMenu);
    }, []);

    const { mutate: liveSetter } = getProductLiveToggle();

    return (
        productIsSuccess && (
            <>
                <section className="flex gap-x-3 items-center px-4 sm:px-0">
                    <NewProductModal />
                    <Button
                        extraClasses={['rounded-xl']}
                        buttonName="Filter"
                        onClickHandler={() => {}}
                    />
                    <Button
                        extraClasses={[
                            'rounded-xl',
                            `${params.sort_bar_active && '!border-white'}`,
                        ]}
                        buttonName="Sort"
                        isActive={params.sort_bar_active}
                        onClickHandler={() => {
                            navigate({
                                search: () => ({
                                    ...params,
                                    sort_bar_active: !params.sort_bar_active,
                                }),
                            });
                        }}
                    />
                    <AnimatePresence>
                        <motion.label
                            layout={true}
                            transition={{ duration: 0.1 }}
                            className={`min-h-[2.4rem] w-fit border-white/30 flex rounded-xl items-center ${params.search_bar_active && 'focus-within:border-white border-[0.1px] bg-background text-white'}`}>
                            <Button
                                buttonName=""
                                isActive={params.search_bar_active}
                                extraClasses={[
                                    '!text-lg !py-[0.82rem] !rounded-xl !cursor-pointer',
                                    `${params.search_bar_active && '!border-0'}`,
                                ]}
                                onClickHandler={() => {
                                    navigate({
                                        search: () => ({
                                            ...params,
                                            search_bar_active:
                                                !params.search_bar_active,
                                        }),
                                    });
                                }}>
                                <FaSearch />
                            </Button>
                            <AnimatePresence>
                                {params.search_bar_active && (
                                    <motion.input
                                        initial={{
                                            width: params.search_bar_active
                                                ? '20rem'
                                                : 0,
                                        }}
                                        animate={{
                                            width: '20rem',
                                            transition: {
                                                duration: 0.2,
                                                delay: 0.2,
                                            },
                                        }}
                                        exit={{
                                            width: 0,
                                        }}
                                        autoFocus={true}
                                        defaultValue={params.search_word}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            debounceSearchInput(e.target.value);
                                        }}
                                        placeholder="Enter title..."
                                        className="h-full left-0 rounded-xl outline-none text-lg bg-background text-white"
                                    />
                                )}
                            </AnimatePresence>
                        </motion.label>
                    </AnimatePresence>
                </section>

                <AnimatePresence>
                    {params.sort_bar_active && (
                        <motion.section
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="relative flex gap-x-3 items-center px-4 sm:px-0"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}>
                            <SelectComponent
                                placeholder="Sort by"
                                options={filterTypeOptions}
                                value={filterTypeOptions.filter(
                                    (e) =>
                                        e.value === (params.sort_by || 'title')
                                )}
                                onChange={(v) => {
                                    navigate({
                                        search: () => ({
                                            ...params,
                                            sort_by: v?.value || 'title',
                                        }),
                                    });
                                }}
                            />
                            <Button
                                buttonName=""
                                extraClasses={['!text-lg !rounded-xl']}
                                onClickHandler={() => {
                                    navigate({
                                        search: () => ({
                                            ...params,
                                            reverse: params.reverse
                                                ? false
                                                : true,
                                        }),
                                    });
                                }}>
                                {params.reverse === true ? (
                                    <FaArrowUpShortWide />
                                ) : (
                                    <FaArrowDownWideShort />
                                )}
                            </Button>
                        </motion.section>
                    )}
                </AnimatePresence>
                <section className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 sm:pr-6 sm:pl-0">
                    {processProducts({
                        products: Object.entries(allProducts),
                        searchURL: new URLSearchParams(
                            params as Record<string, unknown> as Record<
                                string,
                                string
                            >
                        ).toString(),
                    }).map(([key, value], i) => {
                        return (
                            <ProductCard
                                key={key}
                                productData={{
                                    ...value,
                                }}>
                                <Fragment>
                                    <span
                                        className="absolute right-[1rem] top-[1rem] cursor-pointer hover:text-white/70 text-xl"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            contextMenuConfig.active
                                                ? setContextMenuConfig({
                                                      active: false,
                                                      activeIdx: i,
                                                  })
                                                : setContextMenuConfig({
                                                      active: true,
                                                      activeIdx: i,
                                                  });
                                        }}>
                                        <IoMdSettings />
                                    </span>
                                    <AnimatePresence>
                                        {
                                            <motion.menu
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: contextMenuConfig.active
                                                        ? 'fit-content'
                                                        : 0,
                                                    opacity:
                                                        contextMenuConfig.active
                                                            ? 1
                                                            : 0,
                                                    transition: {
                                                        duration: 0.2,
                                                    },
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                className={`${contextMenuConfig.active && contextMenuConfig.activeIdx === i ? 'grid' : 'hidden'} overflow-hidden bg-background border-white/30 border-[0.1px] absolute right-[2rem] top-[2.5rem] text-lg list-none p-0`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}>
                                                <li
                                                    className="pl-4 pr-8 py-3 hover:bg-accent/50 cursor-pointer"
                                                    onClick={async () => {
                                                        try {
                                                            EditProductSchema.parseAsync(
                                                                {
                                                                    ...value,
                                                                }
                                                            );
                                                            await liveSetter({
                                                                key: key,
                                                                live: !value.live,
                                                            });
                                                        } catch (e) {
                                                            if (
                                                                e instanceof
                                                                z.ZodError
                                                            ) {
                                                                setToastRender({
                                                                    active: false,
                                                                    message:
                                                                        'Some fields are empty',
                                                                });
                                                            }
                                                        }

                                                        setContextMenuConfig(
                                                            (prev) => {
                                                                return {
                                                                    ...prev,
                                                                    active: false,
                                                                };
                                                            }
                                                        );
                                                    }}>
                                                    Go Live
                                                </li>
                                                <li>
                                                    <Link
                                                        to={`/products/edit/${key}/home`}
                                                        className="text-white no-underline">
                                                        <span className="pl-4 pr-16 py-3 hover:bg-accent/50 cursor-pointer">
                                                            Edit
                                                        </span>
                                                    </Link>
                                                </li>
                                                <DeleteProductModal
                                                    idx={key}
                                                    setContextMenuConfig={
                                                        setContextMenuConfig
                                                    }
                                                />
                                            </motion.menu>
                                        }
                                    </AnimatePresence>
                                </Fragment>
                            </ProductCard>
                        );
                    })}
                </section>
            </>
        )
    );
};
