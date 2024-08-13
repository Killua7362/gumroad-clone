import { createRef, RefObject, useContext, useEffect, useState } from 'react';

import { queryClient } from '@/app/RouteComponent';
import Button from '@/ui/components/button';
import ProductEditContentDeleteModal from '@/ui/components/modal/ProductEditContentDeleteModal';
import { ReviewComponent } from '@/ui/layouts/ProductEditContentLayout';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import {
    IonItem,
    IonLabel,
    IonReorder,
    IonReorderGroup,
    IonRow,
} from '@ionic/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useFieldArray } from 'react-hook-form';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RemirrorJSON } from 'remirror';
import { ProductContentSearchType } from '.';
import { productEditContext } from '../_layout_edit';

export const Route = createLazyFileRoute(
    '/_protected/_layout/products/edit/$id/_layout_edit/content/'
)({
    component: () => {
        return <ProductEditContentPage />;
    },
});

const ProductEditContentPage = () => {
    const localProductEditContext = useContext(productEditContext);
    const { control, watch, setValue, getValues } = localProductEditContext!;

    const { append, remove, fields } = useFieldArray({
        name: 'contents',
        control,
    });

    const userMail = (queryClient.getQueryData(['loginStatus']) as authSchema)
        .email;

    const pages = watch('contents') || [];

    const searchParams = Route.useSearch();
    const navigate = Route.useNavigate();

    const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>(
        []
    );
    const [contextActive, setContextActive] = useState<boolean[]>([]);

    const [rendered, setRendered] = useState(false);

    const collabs = watch('collabs');
    const collab_active = watch('collab_active');

    useEffect(() => {
        if (!searchParams.page || searchParams.page! > pages.length) {
            navigate({
                search: (prev: ProductContentSearchType) => ({
                    ...prev,
                    page: 1,
                }),
                state: {
                    ...getValues(),
                },
                replace: true,
            });
        }
        setRendered(true);
    }, []);

    useEffect(() => {
        let temp1: RefObject<HTMLInputElement>[] = [];
        let temp2: boolean[] = [];
        for (let i = 0; i < pages.length; i++) {
            temp1 = [...temp1, createRef()];
            temp2 = [...temp2, false];
        }
        setInputRefs(temp1);
        setContextActive(temp2);
    }, [pages.length]);

    return (
        rendered && (
            <>
                <article className="flex lg:justify-start flex-row lg:flex-col gap-y-3 gap-x-6 mt-4 mx-4">
                    <section className="border-white/30 border-[0.1px] flex flex-col gap-y-4 justify-between w-full max-w-[20rem]">
                        <IonReorderGroup
                            disabled={false}
                            onIonItemReorder={(event) => {
                                setValue(
                                    'contents',
                                    event.detail.complete(pages),
                                    {
                                        shouldDirty: true,
                                    }
                                );
                                if (
                                    event.detail.from ===
                                    Number(searchParams.page) - 1
                                ) {
                                    navigate({
                                        search: (
                                            prev: ProductContentSearchType
                                        ) => ({
                                            ...prev,
                                            page: Number(event.detail.to + 1),
                                        }),
                                        state: {
                                            ...getValues(),
                                        },
                                        replace: true,
                                    });
                                }
                            }}
                            className="flex flex-col gap-2">
                            {fields.map((e, i) => {
                                return (
                                    <IonItem key={e.id}>
                                        <IonRow
                                            className={`justify-between flex-nowrap items-center px-2 py-0 overflow-none ${searchParams.page === i + 1 && 'bg-accent/80 text-white'} `}
                                            onClick={() => {
                                                if (
                                                    inputRefs[i].current
                                                        ?.readOnly
                                                ) {
                                                    navigate({
                                                        search: (
                                                            prev: ProductContentSearchType
                                                        ) => ({
                                                            ...prev,
                                                            page: i + 1,
                                                        }),
                                                        state: {
                                                            ...getValues(),
                                                        },
                                                        replace: true,
                                                    });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' &&
                                                    inputRefs[i].current
                                                        ?.readOnly === false
                                                ) {
                                                    inputRefs[
                                                        i
                                                    ].current!.readOnly = true;
                                                }
                                            }}>
                                            <IonReorder className="mt-[0.35rem] mr-[0.3rem]" />
                                            <IonLabel>
                                                <input
                                                    className={`text-lg outline-none p-2 my-1 w-full ${searchParams.page === i + 1 ? 'bg-accent/80 text-white' : 'bg-background text-white'}`}
                                                    placeholder="Untitled..."
                                                    ref={inputRefs[i]}
                                                    readOnly={true}
                                                    value={pages[i].name}
                                                    onChange={(e) => {
                                                        setValue(
                                                            `contents.${i}.name`,
                                                            e.target.value,
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );
                                                    }}
                                                    onBlur={() => {
                                                        inputRefs[
                                                            i
                                                        ].current!.readOnly =
                                                            true;
                                                    }}
                                                />
                                            </IonLabel>
                                            <BsThreeDotsVertical
                                                className="cursor-pointer hover:text-accent/50"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setContextActive((prev) => {
                                                        const temp: boolean[] =
                                                            [...prev];
                                                        temp[i] = !temp[i];
                                                        return temp;
                                                    });
                                                }}
                                            />
                                        </IonRow>
                                        <motion.ul
                                            layout
                                            style={{
                                                display: contextActive[i]
                                                    ? 'block'
                                                    : 'none',
                                                position: 'relative',
                                                height: contextActive[i]
                                                    ? 'fit-content'
                                                    : '0',
                                                opacity: contextActive[i]
                                                    ? '1'
                                                    : '0',
                                                originX: '0px',
                                                originY: '0px',
                                                originZ: '0px',
                                            }}
                                            transition={{
                                                layout: { duration: 0.2 },
                                            }}>
                                            <li
                                                className="p-4 py-3 bg-white text-black cursor-pointer hover:bg-white/90"
                                                onClick={() => {
                                                    inputRefs[
                                                        i
                                                    ].current!.readOnly = false;
                                                    inputRefs[
                                                        i
                                                    ].current?.focus();
                                                }}>
                                                Rename
                                            </li>
                                            {pages.length > 1 && (
                                                <ProductEditContentDeleteModal
                                                    i={i}
                                                    remove={remove}
                                                    pagesLength={pages.length}
                                                />
                                            )}
                                        </motion.ul>
                                    </IonItem>
                                );
                            })}
                        </IonReorderGroup>
                        <Button
                            buttonName="Add page"
                            extraClasses={[`!w-full`]}
                            onClickHandler={() => {
                                append({ name: '', content: '' });
                            }}
                        />
                    </section>
                    <section className="grid gap-y-2">
                        <ReviewComponent />
                        <section className="w-full border-white/30 border-[0.1px] p-4 px-3">
                            <h4 className="text-lg">Author</h4>
                            <ul className="list-none grid gap-y-1 mt-1 text-sm">
                                <li>{userMail}</li>
                                {collab_active &&
                                    collabs.map((e, i) => {
                                        return (
                                            <li key={`${i}_author_id`}>
                                                {e.email}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </section>
                    </section>
                </article>
                <MarkdownEditor
                    pageContent={
                        pages[Number(searchParams.page) - 1]?.content as string
                    }
                    key={searchParams.page}
                    setContent={(data: RemirrorJSON) => {
                        setValue(
                            `contents.${(Number(searchParams.page) || 1) - 1}.content`,
                            JSON.stringify(data),
                            { shouldDirty: true }
                        );
                    }}
                    placeholder="start typing..."
                    theme={{
                        color: {
                            outline: '#09090B',
                            text: 'white',
                        },
                    }}
                />
            </>
        )
    );
};

export default ProductEditContentPage;
