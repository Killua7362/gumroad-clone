import { filterTypeOptions } from '@/forms/schema/misc_schema';
import Button from '@/ui/components/button';
import Loader from '@/ui/components/loader';
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
        <div className="space-y-6">
            <section className="flex flex-wrap gap-4 items-center">
                <NewProductModal />
                <Button
                    extraClasses={[
                        'rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2',
                    ]}
                    buttonName="Filter"
                    onClickHandler={() => {}}
                />
                <Button
                    extraClasses={[
                        'rounded-full px-4 py-2',
                        params.sort_bar_active
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20',
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
                <div className="flex-grow">
                    <motion.div layout className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-white/10 text-white rounded-full py-2 pl-10 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 leading-6"
                            defaultValue={params.search_word}
                            onChange={(e) => {
                                e.preventDefault();
                                debounceSearchInput(e.target.value);
                            }}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                    </motion.div>
                </div>
            </section>

            <AnimatePresence>
                {params.sort_bar_active && (
                    <motion.section
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-4 bg-white/5 rounded-lg p-4"
                        onClick={(e) => e.stopPropagation()}>
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
                            extraClasses={[
                                '!text-lg !rounded-full bg-white/10 hover:bg-white/20 p-2',
                            ]}
                            onClickHandler={() => {
                                navigate({
                                    search: () => ({
                                        ...params,
                                        reverse: !params.reverse,
                                    }),
                                });
                            }}>
                            {params.reverse ? (
                                <FaArrowUpShortWide />
                            ) : (
                                <FaArrowDownWideShort />
                            )}
                        </Button>
                    </motion.section>
                )}
            </AnimatePresence>

            <Suspense
                fallback={
                    <div className="mt-10">
                        <Loader />
                    </div>
                }>
                <Await promise={initialData}>
                    {(data) => {
                        return <ProductCardLayout data={data} />;
                    }}
                </Await>
            </Suspense>
        </div>
    );
};
