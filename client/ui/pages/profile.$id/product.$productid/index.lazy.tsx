import { EditProductSchemaType } from '@/react-query/mutations';
import { getSingleProfileProductFetcher } from '@/react-query/query';
import Button from '@/ui/components/button';
import Loader from '@/ui/components/loader';
import ProductsDetailsPageLayout from '@/ui/layouts/ProductsDetailsPageLayout';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { useRemirrorContext } from '@remirror/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import getSymbolFromCurrency from 'currency-symbol-map';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { FaImage } from 'react-icons/fa';

export const Route = createLazyFileRoute('/profile/$id/product/$productid/')({
    component: () => {
        return <ProductsDetailsPage />;
    },
});
interface ProductsDetailsPageProps {
    preview?: boolean;
    watch?: UseFormWatch<EditProductSchemaType>;
}

const MarkdownChild = ({ data }: { data: string }) => {
    const { setContent } = useRemirrorContext();

    const getJSON = () => {
        try {
            return JSON.parse(data);
        } catch (err) {
            return undefined;
        }
    };

    useEffect(() => {
        setContent(getJSON());
    }, [data]);

    return null!;
};

export const ProductsDetailsPage = ({
    preview = false,
    watch,
}: ProductsDetailsPageProps) => {
    const titleRef = useRef(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const titleIsInView = useInView(titleRef, {
        margin: '-20% 0px 0px 0px',
    });
    const initialData = preview ? undefined : Route.useLoaderData();
    const params = preview ? undefined : Route.useParams();

    const priceInView = useInView(priceRef);

    const {
        data: profileProductData,
        isPending: profileProductPending,
        isSuccess: profileProductSuccess,
    } = getSingleProfileProductFetcher({
        userId: params?.id,
        productId: params?.productid,
        preview: preview,
        initialData: initialData?.singleProductData,
    });

    const title = preview ? watch!('title') : profileProductData?.title;
    const price = preview ? watch!('price') : profileProductData?.price;
    const coverImageSrc = preview
        ? watch!('coverimageSource')
        : profileProductData?.coverimageSource;
    const description = preview
        ? watch!('description')
        : profileProductData?.description;

    const currency_code = preview
        ? watch!('currency_code')
        : profileProductData?.currency_code;

    const contents = preview
        ? watch!('contents')
        : profileProductData?.contents;

    if (profileProductPending && !preview) return <Loader />;

    return (
        (profileProductSuccess || preview) && (
            <ProductsDetailsPageLayout preview={preview}>
                {!preview && (
                    <motion.header
                        transition={{ duration: 0.2 }}
                        layout
                        className={` w-full left-0 flex justify-center items-center bg-background border-b-[0.1px] border-white/20  fixed mt-[-0.3rem] sm:mt-[-4.3rem] overflow-hidden ${titleIsInView ? 'h-[0rem]' : 'min-h-[5rem]'} `}>
                        <section className="w-9/12 xl:w-8/12 text-xl flex justify-between items-center">
                            <h2 className="text-3xl">{title}</h2>
                            <h2
                                className={`${!priceInView && 'hidden md:block'}`}>
                                {price}
                            </h2>
                        </section>
                    </motion.header>
                )}
                <section
                    className={`grid gap-y-3 ${preview ? 'pt-[6rem]' : 'mt-[10rem] sm:mt-[14rem] md:mt-[6rem] pt-24 sm:pt-8 md:pt-10'}`}>
                    <article className="w-11/12 lg:w-10/12 xl:w-8/12 mx-auto flex flex-col mt-2">
                        <section className="w-full min-h-[30rem] max-h-[50rem] bg-accent border-[0.1px] border-white/20">
                            {coverImageSrc && coverImageSrc !== '' ? (
                                <img
                                    src={coverImageSrc!}
                                    height={0}
                                    width={0}
                                    alt="image"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <FaImage className="text-[3rem] sm:text-[4rem] h-[3rem] w-[8rem]" />
                            )}
                        </section>
                        <section className="flex md:flex-row flex-col border-[0.1px] border-t-0 border-white/20 divide-y-[0.1px] md:divide-y-0 md:divide-x-[0.1px] divide-white/20">
                            <section className="grid w-full md:w-8/12 divide-y-[0.1px] divide-white/20">
                                <header
                                    className="divide-y-[0.1px] divide-white/20 flex flex-col"
                                    ref={titleRef}>
                                    <h3 className="text-3xl p-5">{title}</h3>
                                    <ul className="flex text-xl justify-between gap-x-6 divide-x-[0.1px] divide-white/20 list-none">
                                        <li className="p-5">{price}</li>
                                        <li className="w-full p-5">
                                            Akshay bhat
                                        </li>
                                        <li className="w-full p-5">3</li>
                                    </ul>
                                </header>
                                <MarkdownEditor
                                    pageContent={description}
                                    editable={false}
                                    theme={{
                                        color: {
                                            outline: '#09090B',
                                            text: 'white',
                                        },
                                    }}>
                                    <MarkdownChild data={description} />
                                </MarkdownEditor>
                            </section>
                            <article className="md:w-4/12 w-full">
                                <section className="flex flex-col gap-y-4 p-8 items-center w-full">
                                    <header className="w-full">
                                        <h3 className="text-lg">
                                            Name a fair price
                                        </h3>
                                    </header>
                                    <fieldset className="flex items-center w-full border-white/20 border-[0.1px] rounded-xl overflow-hidden py-2 px-4 focus-within:border-white">
                                        <span className="text-2xl">
                                            {getSymbolFromCurrency(
                                                currency_code
                                            )}
                                        </span>
                                        <input
                                            className="bg-background text-white text-base w-full p-2 outline-none"
                                            placeholder="Type your desired amount"
                                            type="number"
                                            min="0"
                                            ref={priceRef}
                                        />
                                    </fieldset>
                                    <ul className="w-full border-white/20 border-[0.1px] flex flex-col divide-y-[0.1px] divide-white/20 rounded-md list-none">
                                        {contents!.map((e) => {
                                            return (
                                                <li className="p-4">
                                                    {e.name}
                                                </li>
                                            );
                                        })}
                                        <li className="p-4 flex justify-between">
                                            <span>Size</span>
                                            <span>12 MB</span>
                                        </li>
                                    </ul>
                                    <Button
                                        buttonName="Add to Cart"
                                        extraClasses={[`!w-full`]}
                                    />
                                    <Button
                                        buttonName="Wishlist"
                                        extraClasses={[`!w-full`]}
                                    />
                                </section>
                                <section>{/*Reviews*/}</section>
                            </article>
                        </section>
                    </article>
                </section>
                <motion.aside
                    transition={{ duration: 0.2 }}
                    layout
                    className={`w-full z-20 md:hidden flex justify-center items-center bg-background border-t-[0.1px] border-white/20  fixed bottom-0 overflow-hidden ${priceInView ? 'h-[0rem]' : 'min-h-[5rem]'} `}>
                    <article
                        className={`w-10/12 xl:w-8/12 text-xl flex ${titleIsInView ? 'justify-end' : 'justify-between '} items-center`}>
                        <header>
                            <h3
                                className={`text-xl ${titleIsInView && 'hidden'}`}>
                                10rs
                            </h3>
                        </header>
                        <main
                            className="text-lg py-2 px-4 border-white/20 hover:text-white/80 border-[0.1px] rounded-xl cursor-pointer"
                            onClick={(e) => {
                                if (priceRef && priceRef.current)
                                    priceRef.current.focus();
                            }}>
                            Want to buy this?
                        </main>
                    </article>
                </motion.aside>
            </ProductsDetailsPageLayout>
        )
    );
};
