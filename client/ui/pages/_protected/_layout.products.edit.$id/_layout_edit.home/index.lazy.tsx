import { hideToastState } from '@/atoms/states';
import { productTypeOptions } from '@/forms/schema/edit_product_schema';
import { currencyTypeOptions } from '@/forms/schema/misc_schema';
import { convertToBase64 } from '@/lib/image_process';
import Button from '@/ui/components/button';
import { SelectComponent } from '@/ui/components/select';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { ProductsDetailsPage } from '@/ui/pages/profile.$id/product.$productid/index.lazy';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Fragment, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFieldArray } from 'react-hook-form';
import { IoTrashBin } from 'react-icons/io5';
import { Runner } from 'react-runner';
import { useSetRecoilState } from 'recoil';
import { RemirrorJSON } from 'remirror';
import { productEditContext } from '../_layout_edit';

export const Route = createLazyFileRoute(
    '/_protected/_layout/products/edit/$id/_layout_edit/home/'
)({
    component: () => {
        return <ProductEditHomePage />;
    },
});

const tagsToString = (tags: typeof productTypeOptions) => {
    return (tags || []).map((ele) => ele.value).join(',');
};

const stringToTags = (typeString: string) => {
    return (typeString || '').trim().split(',');
};

const ProductEditHomePage = () => {
    const localProductEditContext = useContext(productEditContext);
    const { errors, register, setValue, watch, control, setError } =
        localProductEditContext!;

    const setToastRender = useSetRecoilState(hideToastState);

    const params = Route.useParams();
    const collab_active = watch('collab_active') || false;
    const collabs = watch('collabs') || [];
    const description = watch('description') || '**Testing**';
    const currency_code = watch('currency_code') || 'USD';
    const thumbImageSrc = watch('thumbimageSource') || '';
    const coverImageSrc = watch('coverimageSource') || '';

    const code = `
		<div className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProductsDetailsPage preview={true} watch={watch}/>
		</div>
	`;

    const scope = {
        ProductsDetailsPage,
        watch,
    };

    const { append, remove, fields } = useFieldArray({
        name: 'collabs',
        control,
    });

    const onDropThumb = useCallback(async (files: any) => {
        try {
            const convertedImage = (await convertToBase64(files[0])) as string;
            setValue('thumbimageSource', convertedImage, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } catch (err) {
            setError('thumbimageSource', {
                type: 'thumbimageSource',
                message: err,
            });
        }
    }, []);

    const onDropCover = useCallback(async (files: any) => {
        try {
            const convertedImage = (await convertToBase64(files[0])) as string;
            setValue('coverimageSource', convertedImage, {
                shouldDirty: true,
                shouldValidate: true,
            });
        } catch (err) {
            setError('coverimageSource', {
                type: 'coverimageSource',
                message: err,
            });
        }
    }, []);

    const {
        getRootProps: getRootPropsThumb,
        getInputProps: getInputPropsThumb,
        isDragActive: isDragActiveThumb,
    } = useDropzone({ onDrop: onDropThumb });
    const {
        getRootProps: getRootPropsCover,
        getInputProps: getInputPropsCover,
        isDragActive: isDragActiveCover,
    } = useDropzone({ onDrop: onDropCover });

    return (
        <div className="flex flex-col items-center justify-end lg:justify-start xl:justify-center lg:flex-row w-full">
            <div className="flex flex-col gap-y-4 w-11/12 xl:w-6/12 xl:h-[40rem] px-0 xl:px-8 overflow-y-auto bg-background overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-background justify-between gap-y-4">
                <div className="flex flex-col gap-y-2">
                    <span>Name</span>
                    <fieldset className="border-white/30 border-[0.1px] rounded-md">
                        <input
                            className="outline-none bg-background text-white w-full text-lg"
                            {...register('title')}
                        />
                        {errors.title && (
                            <legend className="text-sm text-red-400">
                                {errors.title.message}
                            </legend>
                        )}
                    </fieldset>
                </div>
                <div className="flex flex-col gap-y-2">
                    <span>Product Type</span>
                    <SelectComponent
                        isMulti={true}
                        options={productTypeOptions}
                        value={[
                            ...productTypeOptions.filter((data) =>
                                stringToTags(watch('tags')).includes(data.value)
                            ),
                        ]}
                        placeholder="Proudct type..."
                        onChange={(v) => {
                            setValue('tags', tagsToString([...v]), {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                    />
                    {errors.tags && (
                        <legend className="text-sm text-red-400">
                            {errors.tags.message}
                        </legend>
                    )}
                </div>
                <div className="flex flex-col gap-y-2">
                    <div>Summary</div>
                    <fieldset className="border-white/30 border-[0.1px] rounded-md">
                        <input
                            className="outline-none bg-background text-white w-full text-lg"
                            {...register('summary')}
                        />
                        {errors.summary && (
                            <legend className="text-sm text-red-400">
                                {errors.summary.message}
                            </legend>
                        )}
                    </fieldset>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div>Description</div>
                    <MarkdownEditor
                        pageContent={description}
                        setContent={(data: RemirrorJSON) => {
                            setValue(`description`, JSON.stringify(data), {
                                shouldDirty: true,
                            });
                        }}
                        placeholder="start typing..."
                        theme={{
                            color: {
                                outline: '#09090B',
                                text: 'white',
                            },
                        }}></MarkdownEditor>
                    {errors.description && description?.length! <= 10 && (
                        <legend className="text-sm text-red-400">
                            {errors.description.message}
                        </legend>
                    )}
                </div>
                <div className="flex flex-col gap-y-2 relative">
                    <div>Thumbnail</div>
                    <div
                        className={`${errors.thumbimageSource ? 'border-red-400' : 'border-white/30'} border-dashed border-[0.1px] p-10 flex items-center justify-center flex-col gap-y-4`}
                        {...getRootPropsThumb()}>
                        {thumbImageSrc !== '' && (
                            <img
                                src={thumbImageSrc}
                                className="h-full w-full object-contain"
                            />
                        )}
                        <div className="flex gap-x-4">
                            <Button buttonName="" extraClasses={['!p-0']}>
                                <label
                                    htmlFor="thumbimage"
                                    className="px-4 py-2 cursor-pointer overflow-none">
                                    Upload
                                </label>
                            </Button>
                            {thumbImageSrc !== '' && (
                                <Button
                                    buttonName="Delete"
                                    variant="destructive"
                                    onClickHandler={() => {
                                        setValue('thumbimageSource', '', {
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                            )}
                        </div>
                        {isDragActiveThumb && (
                            <div className="absolute w-full h-[95%] m-auto flex items-center justify-center backdrop-blur-sm border-2 border-dashed text-2xl">
                                Drop the image here
                            </div>
                        )}
                        {errors.thumbimageSource && (
                            <div className="text-sm text-red-400">
                                {errors.thumbimageSource.message}
                            </div>
                        )}
                        <input
                            type="file"
                            id="thumbimage"
                            name="thumnail"
                            accept="image/png, image/jpeg"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                e.preventDefault();
                                try {
                                    const convertedImage =
                                        (await convertToBase64(
                                            e.target.files![0]
                                        )) as string;
                                    setValue(
                                        'thumbimageSource',
                                        convertedImage,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        }
                                    );
                                } catch (err) {
                                    setError('thumbimageSource', {
                                        type: 'thumbimageSource',
                                        message: err,
                                    });
                                }
                            }}
                            {...getInputPropsThumb()}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 relative">
                    <div>Cover</div>
                    <div
                        className={`${errors.coverimageSource ? 'border-red-400' : 'border-white/30'} border-dashed border-[0.1px] p-10 flex items-center justify-center flex-col gap-y-4`}
                        {...getRootPropsCover()}>
                        {coverImageSrc !== '' && (
                            <img
                                src={coverImageSrc}
                                className="h-full w-full object-contain"
                            />
                        )}
                        <div className="flex gap-x-4">
                            <Button buttonName="" extraClasses={['!p-0']}>
                                <label
                                    htmlFor="coverImage"
                                    className="px-4 py-2 cursor-pointer overflow-none">
                                    Upload
                                </label>
                            </Button>
                            {coverImageSrc !== '' && (
                                <Button
                                    buttonName="Delete"
                                    variant="destructive"
                                    onClickHandler={() => {
                                        setValue('coverimageSource', '', {
                                            shouldDirty: true,
                                        });
                                    }}
                                />
                            )}
                        </div>
                        {isDragActiveCover && (
                            <div className="absolute w-full h-[95%] m-auto flex items-center justify-center backdrop-blur-sm border-2 border-dashed text-2xl">
                                Drop the image here
                            </div>
                        )}
                        {errors.coverimageSource && (
                            <div className="text-sm text-red-400">
                                {errors.coverimageSource.message}
                            </div>
                        )}
                        <input
                            type="file"
                            id="coverImage"
                            name="thumnail"
                            accept="image/png, image/jpeg"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                e.preventDefault();
                                try {
                                    const convertedImage =
                                        (await convertToBase64(
                                            e.target.files![0]
                                        )) as string;
                                    setValue(
                                        'coverimageSource',
                                        convertedImage,
                                        {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        }
                                    );
                                } catch (err) {
                                    setError('coverimageSource', {
                                        type: 'coverimageSource',
                                        message: err,
                                    });
                                }
                            }}
                            {...getInputPropsCover()}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-3">
                    <div>Price</div>
                    <fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white flex">
                        <SelectComponent
                            placeholder="Enter Price..."
                            options={currencyTypeOptions}
                            value={{
                                value: currency_code,
                                label: currency_code,
                            }}
                            width="95px"
                            onChange={(v) => {
                                setValue('currency_code', v?.value || 'USD', {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }}
                        />
                        <input
                            className="w-full text-lg bg-background text-white outline-none px-4"
                            type="number"
                            step="any"
                            {...register('price')}
                        />
                        {errors.price && (
                            <legend className="text-sm text-red-400">
                                {errors.price.message}
                            </legend>
                        )}
                    </fieldset>
                </div>
                <div className="flex flex-col gap-y-3">
                    <div>Collabs</div>
                    <div className="flex gap-x-4">
                        <input
                            type="checkbox"
                            className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            defaultChecked={collab_active}
                            onChange={(e) => {
                                setValue('collab_active', !collab_active, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }}
                        />
                        <div className="text-base">Activate Collab</div>
                    </div>
                    {collab_active && (
                        <Fragment>
                            <div className="flex gap-x-4 items-center text-lg text-white/70">
                                <fieldset className="border-white/30 w-full border-[0.1px] rounded-md p-2 focus-within:border-white">
                                    <legend className="text-sm">member</legend>
                                    <div className="w-full">Me</div>
                                </fieldset>
                                <fieldset className="border-white/30 w-full border-[0.1px] rounded-md p-2 focus-within:border-white">
                                    <legend className="text-sm">
                                        Share(in %)
                                    </legend>
                                    <div className="w-full">
                                        {collabs === undefined
                                            ? 100
                                            : 100 -
                                              collabs.reduce(
                                                  (a, { share }) =>
                                                      a + (Number(share) || 0),
                                                  0
                                              )}
                                    </div>
                                </fieldset>
                            </div>
                            {errors.collabs && errors.collabs['root'] && (
                                <div className="text-red-400 text-sm">
                                    {errors.collabs['root']?.message}
                                </div>
                            )}
                            {errors.collabs && (
                                <div className="text-red-400 text-sm">
                                    {errors.collabs.message}
                                </div>
                            )}
                            {fields.map((collab, index) => {
                                return (
                                    <div
                                        className="flex gap-x-4 items-center"
                                        key={collab.id}>
                                        <div>{index + 1}</div>
                                        <fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
                                            <input
                                                className="text-lg bg-background text-white outline-none px-4"
                                                {...register(
                                                    `collabs.${index}.email`
                                                )}
                                            />
                                            {errors.collabs &&
                                                errors.collabs[index]
                                                    ?.email && (
                                                    <legend className="text-red-400 text-sm">
                                                        {
                                                            errors.collabs[
                                                                index
                                                            ]?.email?.message
                                                        }
                                                    </legend>
                                                )}
                                        </fieldset>
                                        <fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-white">
                                            <input
                                                className="text-lg bg-background text-white outline-none px-4"
                                                {...register(
                                                    `collabs.${index}.share`
                                                )}
                                            />
                                            {errors.collabs &&
                                                errors.collabs[index]
                                                    ?.share && (
                                                    <legend className="text-red-400 text-sm">
                                                        {
                                                            errors.collabs[
                                                                index
                                                            ]?.share?.message
                                                        }
                                                    </legend>
                                                )}
                                        </fieldset>
                                        <IoTrashBin
                                            className="text-red-400 cursor-pointer"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                            <Button
                                buttonName="Add new member"
                                extraClasses={[`!w-full`]}
                                onClickHandler={() => {
                                    append({
                                        email: '',
                                        share: 1,
                                        approved: false,
                                    });
                                }}
                            />
                        </Fragment>
                    )}
                </div>
                <div className="flex flex-col gap-y-3">
                    <div>Settings</div>
                    <div className="flex flex-col gap-y-2">
                        <div className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <div className="text-base">
                                Allow customers to pay whatever they want
                            </div>
                        </div>
                        <div className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <div className="text-base">
                                Allow customers to leave Reviews
                            </div>
                        </div>
                        <div className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <div className="text-base">
                                Show number of sales
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`w-6/12 h-[40rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}>
                <div className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
                    Preview
                </div>
                <Runner scope={scope} code={code} />
            </div>
        </div>
    );
};
