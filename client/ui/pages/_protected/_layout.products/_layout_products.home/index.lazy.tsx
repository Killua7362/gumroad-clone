import { filterTypeOptions } from '@/forms/schema/misc_schema';
import Button from '@/ui/components/button';
import NewProductModal from '@/ui/components/modal/NewProductModal';
import ProductCardLayout from '@/ui/components/profile/layout/ProductCardLayout';
import { SelectComponent } from '@/ui/components/select';
import { Await, createLazyFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { Suspense } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaArrowDownWideShort, FaArrowUpShortWide } from 'react-icons/fa6';

export const Route = createLazyFileRoute(
    '/_protected/_layout/products/_layout_products/home/'
)({
    component: () => {
        return <ProductsHomePage />;
    },
});

export interface ProductsCardContextMenu {
    active: boolean;
    activeIdx: string;
}

const ProductsHomePage = () => {
    const { initialData } = Route.useLoaderData();
    const params = Route.useSearch();

    const navigate = Route.useNavigate();

    const debounceSearchInput = _.debounce((value: string) => {
        navigate({
            search: () => ({ ...params, search_word: value }),
        });
    }, 300);

    return (
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
                                    e.value === (params.sort_by || 'updated_at')
                            )}
                            onChange={(v) => {
                                navigate({
                                    search: () => ({
                                        ...params,
                                        sort_by:
                                            (v?.value as typeof params.sort_by) ||
                                            'updated_at',
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
                                        reverse: params.reverse ? false : true,
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
            <Suspense fallback={<div>Testing</div>}>
                <Await promise={initialData}>
                    {(data) => {
                        return <ProductCardLayout data={data} />;
                    }}
                </Await>
            </Suspense>
        </>
    );
};
