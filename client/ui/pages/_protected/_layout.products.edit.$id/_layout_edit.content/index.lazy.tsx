import { createRef, useContext, useEffect, useReducer, useState } from 'react';

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
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
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

interface State {
    readOnly: boolean[];
    contextActive: boolean[];
    renameInputRefs: any[];
}

interface Action {
    type: 'toggle_context' | 'toggle_readonly' | 'add_page';
    idx?: number;
}

const reducer = (state: State, action: Action) => {
    const { type } = action;

    let newContextActive: boolean[] = [...state.contextActive];
    let newReadOnly: boolean[] = [...state.readOnly];
    let newRenameInputRefs: any[] = [...state.renameInputRefs];
    switch (type) {
        case 'toggle_context':
            newContextActive[action.idx!] = !state.contextActive[action.idx!];
            return {
                ...state,
                contextActive: newContextActive,
            };
        case 'toggle_readonly':
            newReadOnly[action.idx!] = !state.readOnly[action.idx!];
            return {
                ...state,
                readOnly: newReadOnly,
            };
        case 'add_page':
            return {
                contextActive: [...newContextActive, false],
                readOnly: [...newReadOnly, true],
                renameInputRefs: [...newRenameInputRefs, createRef()],
            };
        default:
            return state;
    }
};

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

    const [state, dispatch] = useReducer(reducer, {
        readOnly: Array(pages.length).fill(true),
        contextActive: Array(pages.length).fill(false),
        renameInputRefs: Array(pages.length).fill(createRef()),
    });

    const searchParams = Route.useSearch();
    const navigate = Route.useNavigate();

    const [rendered, setRendered] = useState(false);

    const collabs = watch('collabs');
    const collab_active = watch('collab_active');

    useEffect(() => {
        if (!searchParams.page || searchParams.page! <= 0) {
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
        } else if (searchParams.page! > pages.length) {
            navigate({
                search: (prev: ProductContentSearchType) => ({
                    ...prev,
                    page: pages.length,
                }),
                state: {
                    ...getValues(),
                },
                replace: true,
            });
        }
        setRendered(true);
    }, []);

    return (
        rendered && (
            <>
                <article className="flex lg:justify-start flex-row lg:flex-col gap-y-3 gap-x-6 mt-4 mx-4">
                    <section className="border-white/30 border-[0.1px] flex flex-col gap-y-4 justify-between w-full max-w-[20rem] rounded-lg">
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
                                            className={`justify-between flex-nowrap cursor-pointer items-center px-2 py-0 overflow-none ${searchParams.page === i + 1 && 'bg-white/5 text-white'} `}
                                            onClick={() => {
                                                if (
                                                    searchParams.page ===
                                                        i + 1 &&
                                                    state.readOnly[i]
                                                ) {
                                                    dispatch({
                                                        type: 'toggle_context',
                                                        idx: i,
                                                    });
                                                    return;
                                                } else {
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
                                                    !state.readOnly[i]
                                                ) {
                                                    dispatch({
                                                        type: 'toggle_readonly',
                                                        idx: i,
                                                    });
                                                }
                                            }}>
                                            <IonReorder className="mt-[0.35rem] mr-[0.3rem]" />
                                            <IonLabel className="w-full">
                                                <div
                                                    className={`text-lg p-2 my-1 w-full ${searchParams.page === i + 1 ? 'bg-inherit text-white' : 'bg-background text-white'}`}>
                                                    {pages[i].name ||
                                                        'Untitled'}
                                                </div>
                                            </IonLabel>
                                            <BsThreeDotsVertical
                                                className="cursor-pointer hover:text-accent/50"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    dispatch({
                                                        type: 'toggle_context',
                                                        idx: i,
                                                    });
                                                }}
                                            />
                                        </IonRow>
                                        <motion.ul
                                            layout
                                            style={{
                                                display: state.contextActive[i]
                                                    ? 'block'
                                                    : 'none',
                                                position: 'relative',
                                                height: state.contextActive[i]
                                                    ? 'fit-content'
                                                    : '0',
                                                opacity: state.contextActive[i]
                                                    ? '1'
                                                    : '0',
                                                originX: '0px',
                                                originY: '0px',
                                                originZ: '0px',
                                            }}
                                            transition={{
                                                layout: { duration: 0.2 },
                                            }}
                                            className="list-none bg-background hover:bg-white/5">
                                            <div
                                                className="p-0 flex relative"
                                                tabIndex={-1}
                                                onBlur={(e) => {
                                                    if (
                                                        !e.currentTarget.contains(
                                                            e.relatedTarget
                                                        )
                                                    ) {
                                                        dispatch({
                                                            type: 'toggle_readonly',
                                                            idx: i,
                                                        });

                                                        state.renameInputRefs[
                                                            i
                                                        ].current.value =
                                                            'Rename';
                                                    }
                                                }}>
                                                <input
                                                    ref={
                                                        state.renameInputRefs[i]
                                                    }
                                                    className={`text-lg outline-none min-w-0 w-auto px-4 py-2 text-white bg-inherit ${state.readOnly[i] && 'cursor-pointer'}`}
                                                    placeholder="Untitled..."
                                                    readOnly={state.readOnly[i]}
                                                    defaultValue={'Rename'}
                                                    onClick={(e) => {
                                                        if (state.readOnly[i]) {
                                                            dispatch({
                                                                type: 'toggle_readonly',
                                                                idx: i,
                                                            });
                                                            e.currentTarget.value =
                                                                pages[i].name;
                                                        }
                                                    }}
                                                />
                                                {!state.readOnly[i] && (
                                                    <section className="flex gap-x-2 py-2 mr-2 absolute right-0">
                                                        <Button
                                                            buttonName=""
                                                            extraClasses={[
                                                                '!p-1',
                                                            ]}
                                                            onClickHandler={() => {
                                                                setValue(
                                                                    `contents.${i}.name`,
                                                                    state
                                                                        .renameInputRefs[
                                                                        i
                                                                    ].current
                                                                        .value,
                                                                    {
                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                            }}>
                                                            <FaCheck />
                                                        </Button>
                                                        <Button
                                                            buttonName=""
                                                            extraClasses={[
                                                                '!p-1',
                                                            ]}>
                                                            <RxCross2 />
                                                        </Button>
                                                    </section>
                                                )}
                                            </div>
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
                            extraClasses={[`!w-full !rounded-lg`]}
                            onClickHandler={() => {
                                append({ name: '', content: '' });
                                dispatch({
                                    type: 'add_page',
                                });
                            }}
                        />
                    </section>
                    <section className="grid gap-y-2">
                        <ReviewComponent />
                        <section className="w-full border-white/30 border-[0.1px] p-4 px-3 rounded-lg">
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
