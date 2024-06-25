import {
  createRef,
  Fragment,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';

import Button from '@/ui/components/button';
import ProductEditContentDeleteModal from '@/ui/components/modal/ProductEditContentDeleteModal';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import {
  IonItem,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  IonRow,
} from '@ionic/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useFieldArray, useFormState } from 'react-hook-form';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
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

interface Review {
  reviewEdit: boolean;
  reviewScore: number;
  tempReviewScore: number;
  tempSelectReviewScore: number;
  reviewDescription: string;
  tempReviewDescription: string;
}

const ProductEditContentPage = () => {
  const localProductEditContext = useContext(productEditContext);
  const { control, watch, setValue, getValues } = localProductEditContext!;

  const { append, remove, fields } = useFieldArray({
    name: 'contents',
    control,
  });

  const pages = watch('contents') || [];

  const { dirtyFields } = useFormState({ control });

  useEffect(() => {
    const temp = pages[0]!.content;
    if (temp !== '') {
      console.log(JSON.parse(temp));
    }
  }, [pages[0]!.content]);

  const [reviewOptions, setReviewOptions] = useState<Review>({
    reviewEdit: false,
    reviewScore: 1,
    tempReviewScore: 1,
    tempSelectReviewScore: 1,
    reviewDescription: '',
    tempReviewDescription: '',
  });

  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const [renaming, setRenaming] = useState(false);

  const [inputRefs, setInputRefs] = useState<RefObject<HTMLInputElement>[]>([]);
  const [contextActive, setContextActive] = useState<boolean[]>([]);

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!searchParams.page || searchParams.page! > pages.length) {
      navigate({
        search: (prev: ProductContentSearchType) => ({ ...prev, page: 1 }),
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
      <Fragment>
        <div className="flex lg:justify-start flex-row lg:flex-col gap-y-3 gap-x-6 mt-10 mx-4">
          <div className="border-white/30 border-[0.1px] flex flex-col gap-y-4 justify-between w-full max-w-[20rem]">
            <IonList>
              <IonReorderGroup
                disabled={false}
                onIonItemReorder={(event) => {
                  setValue('contents', event.detail.complete(pages), {
                    shouldDirty: true,
                  });
                  navigate({
                    search: (prev: ProductContentSearchType) => ({
                      ...prev,
                      page: (event.detail.to + 1) as number,
                    }),
                    state: {
                      ...getValues(),
                    },
                    replace: true,
                  });
                }}
                className="flex flex-col gap-2">
                {fields.map((e, i) => {
                  return (
                    <IonItem key={e.id}>
                      <IonRow
                        className={`justify-between flex-nowrap items-center px-2 py-0 overflow-none ${searchParams.page === i + 1 && 'bg-accent/80 text-white'} `}
                        onClick={() => {
                          if (inputRefs[i].current?.readOnly) {
                            navigate({
                              search: (prev: ProductContentSearchType) => ({
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
                            inputRefs[i].current?.readOnly === false
                          ) {
                            inputRefs[i].current!.readOnly = true;
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
                              setValue(`contents.${i}.name`, e.target.value, {
                                shouldDirty: true,
                              });
                            }}
                            onBlur={() => {
                              inputRefs[i].current!.readOnly = true;
                            }}
                          />
                        </IonLabel>
                        <BsThreeDotsVertical
                          className="cursor-pointer hover:text-accent/50"
                          onClick={(event) => {
                            event.stopPropagation();
                            setContextActive((prev) => {
                              const temp: boolean[] = [...prev];
                              temp[i] = !temp[i];
                              return temp;
                            });
                          }}
                        />
                      </IonRow>
                      <motion.div
                        layout
                        style={{
                          display: contextActive[i] ? 'block' : 'none',
                          position: 'relative',
                          height: contextActive[i] ? 'fit-content' : '0',
                          opacity: contextActive[i] ? '1' : '0',
                          originX: '0px',
                          originY: '0px',
                          originZ: '0px',
                        }}
                        transition={{
                          layout: { duration: 0.2 },
                        }}>
                        <div
                          className="p-4 py-3 bg-white text-black cursor-pointer hover:bg-white/90"
                          onClick={() => {
                            inputRefs[i].current!.readOnly = false;
                            inputRefs[i].current?.focus();
                          }}>
                          Rename
                        </div>
                        {pages.length > 1 && (
                          <ProductEditContentDeleteModal
                            i={i}
                            remove={remove}
                            pagesLength={pages.length}
                          />
                        )}
                      </motion.div>
                    </IonItem>
                  );
                })}
              </IonReorderGroup>
            </IonList>
            <Button
              buttonName="Add page"
              extraClasses={[`!w-full`]}
              onClickHandler={() => {
                append({ name: '', content: '' });
              }}
            />
          </div>
          <div className="flex flex-col w-full max-w-[20rem] border-white/30 border-[0.1px] h-fit p-4 justify-center items-center gap-y-3">
            <div className="p-2 text-2xl">Review</div>
            <div className="flex gap-x-4 px-1 justify-between w-full">
              <div className="text-lg">Rating:</div>
              <div className="flex my-[0.1rem]">
                {new Array(5).fill(0).map((e, i) => {
                  return (
                    <div
                      key={`review_star_${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        reviewOptions.reviewEdit &&
                          setReviewOptions((prev) => {
                            return { ...prev, tempReviewScore: i + 1 };
                          });
                      }}
                      onMouseLeave={() => {
                        reviewOptions.reviewEdit &&
                          setReviewOptions((prev) => {
                            return {
                              ...prev,
                              tempReviewScore:
                                reviewOptions.tempSelectReviewScore,
                            };
                          });
                      }}
                      onClick={() => {
                        reviewOptions.reviewEdit &&
                          setReviewOptions((prev) => {
                            return { ...prev, tempSelectReviewScore: i + 1 };
                          });
                      }}>
                      {i < reviewOptions.tempReviewScore ? (
                        <FaStar />
                      ) : (
                        <CiStar />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {reviewOptions.reviewEdit ? (
              <div>
                <fieldset className="border-white/30 border-[0.1px] focus-within:border-white">
                  <textarea
                    style={{
                      fontFamily: 'inherit',
                    }}
                    className="bg-background text-white outline-none text-base resize-none h-[6rem]"
                    value={reviewOptions.tempReviewDescription}
                    onChange={(event) => {
                      event.preventDefault();
                      reviewOptions.reviewEdit &&
                        event.currentTarget?.value &&
                        setReviewOptions((prev) => {
                          return {
                            ...prev,
                            tempReviewDescription: event.currentTarget.value,
                          };
                        });
                    }}
                  />
                </fieldset>
              </div>
            ) : (
              <div className="text-base w-full">
                {reviewOptions.reviewDescription === ''
                  ? 'No Description'
                  : reviewOptions.reviewDescription}
              </div>
            )}
            {reviewOptions.reviewEdit && (
              <div className="flex gap-x-2 w-full">
                <Button
                  extraClasses={[`!w-full`]}
                  buttonName={'Save'}
                  onClickHandler={() => {
                    setReviewOptions((prev) => {
                      return {
                        ...prev,
                        reviewEdit: false,
                        reviewDescription: reviewOptions.tempReviewDescription,
                        reviewScore: reviewOptions.tempSelectReviewScore,
                      };
                    });
                  }}
                />
                <Button
                  extraClasses={[`!w-full`]}
                  buttonName={'Cancel'}
                  onClickHandler={() => {
                    setReviewOptions((prev) => {
                      return {
                        ...prev,
                        reviewEdit: false,
                        tempReviewDescription: reviewOptions.reviewDescription,
                        tempReviewScore: reviewOptions.reviewScore,
                      };
                    });
                  }}
                />
              </div>
            )}
            {!reviewOptions.reviewEdit && (
              <Button
                extraClasses={[`!w-full`]}
                buttonName={'Edit Review'}
                onClickHandler={() => {
                  setReviewOptions((prev) => {
                    return { ...prev, reviewEdit: true };
                  });
                }}
              />
            )}
          </div>
        </div>
        <MarkdownEditor
          pageContent={
            pages[(searchParams.page as number) - 1]?.content as string
          }
          key={searchParams.page}
          setContent={(data: RemirrorJSON) => {
            setValue(
              `contents.${((searchParams.page || 1) as number) - 1}.content`,
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
          }}></MarkdownEditor>
      </Fragment>
    )
  );
};

export default ProductEditContentPage;
