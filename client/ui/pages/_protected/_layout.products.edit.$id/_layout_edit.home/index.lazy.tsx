import { hideToastState } from '@/atoms/states';
import { productTypeOptions } from '@/forms/schema/edit_product_schema';
import { currencyTypeOptions } from '@/forms/schema/misc_schema';
import { convertToBase64 } from '@/lib/image_process';
import { EditProductSchemaType } from '@/react-query/mutations';
import Button from '@/ui/components/button';
import { FormInput } from '@/ui/components/forms';
import { SelectComponent } from '@/ui/components/select';
import { MarkdownEditor } from '@/ui/misc/markdown-editor';
import { ProductsDetailsPage } from '@/ui/pages/profile.$id/product.$productid/index.lazy';
import { createLazyFileRoute } from '@tanstack/react-router';
import _ from 'lodash';
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
		<article className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProductsDetailsPage preview={true} watch={watch}/>
		</article>
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
        <article className="w-full flex flex-col items-center sm:items-start xl:flex-row">
            <section className="grid gap-y-4 w-full lg:w-6/12 lg:h-[38rem] px-4 sm:pr-6 sm:pl-0 xl:px-5 overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background">
                <label className="grid gap-y-4">
                    <h2 className="text-xl">Name</h2>
                    <FormInput<EditProductSchemaType>
                        name="title"
                        errors={errors}
                        register={register}
                        placeholder="Name"
                        type="text"
                    />
                </label>
                <label className="grid gap-y-4">
                    <h2 className="text-xl">Product Type</h2>
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
                </label>
                <label className="grid gap-y-4">
                    <h2 className="text-xl">Summary</h2>
                    <FormInput<EditProductSchemaType>
                        name="summary"
                        errors={errors}
                        register={register}
                        placeholder="Name"
                        type="text"
                    />
                </label>
                <section className="grid gap-y-4">
                    <h2 className="text-xl">Description</h2>
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
                </section>
                <label className="grid gap-y-4 relative">
                    <h2 className="text-xl">Thumbnail</h2>
                    <section
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
                            <p className="absolute w-full h-[95%] m-auto flex items-center justify-center backdrop-blur-sm border-2 border-dashed text-2xl">
                                Drop the image here
                            </p>
                        )}
                        {errors.thumbimageSource && (
                            <p className="text-sm text-red-400">
                                {errors.thumbimageSource.message}
                            </p>
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
                    </section>
                </label>
                <label className="grid gap-y-4 relative">
                    <h2 className="text-xl">Cover</h2>
                    <section
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
                            <p className="absolute w-full h-[95%] m-auto flex items-center justify-center backdrop-blur-sm border-2 border-dashed text-2xl">
                                Drop the image here
                            </p>
                        )}
                        {errors.coverimageSource && (
                            <p className="text-sm text-red-400">
                                {errors.coverimageSource.message}
                            </p>
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
                    </section>
                </label>
                <label className="grid gap-y-4">
                    <h2 className="text-xl">Price</h2>
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
                </label>
                <section className="grid gap-y-4">
                    <h2 className="text-xl">Collabs</h2>
                    <label className="flex gap-x-4">
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
                        <span className="text-base">Activate Collab</span>
                    </label>
                    {collab_active && (
                        <Fragment>
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

                            <table className="text-start border-spacing-2 text-base border-separate">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Email</th>
                                        <th>Share</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((collab, index) => {
                                        return (
                                            <tr key={collab.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <FormInput<EditProductSchemaType>
                                                        name={`collabs.${index}.email`}
                                                        errors={errors}
                                                        register={register}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </td>
                                                <td>
                                                    <FormInput<EditProductSchemaType>
                                                        name={`collabs.${index}.share`}
                                                        errors={errors}
                                                        register={register}
                                                        placeholder=""
                                                        type="text"
                                                    />
                                                </td>
                                                <td>
                                                    <IoTrashBin
                                                        className="text-red-400 cursor-pointer text-xl"
                                                        onClick={() => {
                                                            remove(index);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="text-lg">
                                    <tr>
                                        <td></td>
                                        <td>Remaining share</td>
                                        <td>
                                            {100 -
                                                _.sum(
                                                    watch('collabs').map(
                                                        (e) => e.share
                                                    )
                                                )}
                                            %
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
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
                </section>
                <section className="grid gap-y-4">
                    <h2 className="text-xl">Settings</h2>
                    <article className="grid gap-y-2">
                        <label className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <span className="text-base">
                                Allow customers to pay whatever they want
                            </span>
                        </label>
                        <label className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <span className="text-base">
                                Allow customers to leave Reviews
                            </span>
                        </label>
                        <label className="flex gap-x-4">
                            <input
                                type="checkbox"
                                className=" bg-background text-white border-white/30 border-[0.1px] p-1 w-fit"
                            />
                            <span className="text-base">
                                Show number of sales
                            </span>
                        </label>
                    </article>
                </section>
            </section>
            <section
                className={`w-6/12 h-[38rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] lg:block border-white/30 p-2 px-0 border-l-[0.1px]`}>
                <span className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
                    Preview
                </span>
                <Runner scope={scope} code={code} />
            </section>
        </article>
    );
};
