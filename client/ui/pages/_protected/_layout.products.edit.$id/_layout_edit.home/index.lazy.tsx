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
    const { watch } = localProductEditContext!;
    const code = `
		<article className="w-[60vw] mb-[-10rem] min-h-screen relative origin-top-left bg-background pointer-events-none" style={{transform:'scale(0.8)'}}>
			<ProductsDetailsPage preview={true} watch={watch}/>
		</article>
	`;

    const scope = {
        ProductsDetailsPage,
        watch,
    };

    return (
        <article className="w-full flex flex-col items-center sm:items-start lg:flex-row">
            <section className="grid gap-y-4 w-full xl:w-6/12 xl:h-[38rem] px-4 sm:pr-6 sm:pl-0 xl:px-5 overflow-y-auto bg-background scrollbar-thin scrollbar-thumb-white scrollbar-track-background">
                <MainSection />
                <ImageSection />
                <CollabSection />
                <SettingsSection />
            </section>
            <section
                className={`w-6/12 h-[38rem] overflow-x-auto overflow-y-auto bg-background scrollbar-none  hidden border-x-[0px] xl:block border-white/30 p-2 px-0 border-l-[0.1px]`}>
                <span className="m-3 mt-1 text-xl uppercase font-medium tracking-widest text-white/70">
                    Preview
                </span>
                <Runner scope={scope} code={code} />
            </section>
        </article>
    );
};

const MainSection = () => {
    const localProductEditContext = useContext(productEditContext);
    const { errors, register, setValue, watch } = localProductEditContext!;
    const description = watch('description') || '**Testing**';
    const currency_code = watch('currency_code') || 'USD';
    return (
        <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Main</h2>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Name</h2>
                <FormInput<EditProductSchemaType>
                    name="title"
                    errors={errors}
                    register={register}
                    placeholder="Enter product name"
                    type="text"
                    className="w-full bg-background"
                />
            </div>

            <div className="grid gap-y-4">
                <h2 className="text-xl font-semibold text-white">Price</h2>
                <fieldset className="border-white/30 border-[0.1px] rounded-md p-2 focus-within:border-blue-500 focus-within:ring-blue-500 flex bg-background">
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
                        className="w-full text-lg bg-background text-white outline-none px-4 ml-4"
                        type="number"
                        step="any"
                        placeholder="Type your price..."
                        {...register('price')}
                    />
                    {errors.price && (
                        <legend className="text-sm text-red-400">
                            {errors.price.message as string}
                        </legend>
                    )}
                </fieldset>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                    Product Type
                </h2>
                <SelectComponent
                    isMulti={true}
                    options={productTypeOptions}
                    value={[
                        ...productTypeOptions.filter((data) =>
                            stringToTags(watch('tags')).includes(data.value)
                        ),
                    ]}
                    placeholder="Select product type(s)..."
                    onChange={(v) => {
                        setValue('tags', tagsToString([...v]), {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }}
                />
                {errors.tags && (
                    <p className="text-sm text-red-400">
                        {errors.tags.message as string}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Summary</h2>
                <FormInput<EditProductSchemaType>
                    name="summary"
                    errors={errors}
                    register={register}
                    placeholder="Enter product summary"
                    type="text"
                    className="w-full bg-background "
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">
                    Description
                </h2>
                <MarkdownEditor
                    pageContent={description}
                    setContent={(data: RemirrorJSON) => {
                        setValue(`description`, JSON.stringify(data), {
                            shouldDirty: true,
                        });
                    }}
                    placeholder="Start typing your product description..."
                    theme={{
                        color: {
                            outline: '#1F2937',
                            text: 'white',
                        },
                    }}
                />
                {errors.description && description?.length! <= 10 && (
                    <p className="text-sm text-red-400">
                        {errors.description.message as string}
                    </p>
                )}
            </div>
        </div>
    );
};

const ImageSection = () => {
    const localProductEditContext = useContext(productEditContext);
    const { errors, setValue, watch, setError } = localProductEditContext!;

    const thumbImageSrc = watch('thumbimageSource') || '';
    const coverImageSrc = watch('coverimageSource') || '';
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
        <div className="space-y-6 bg-white/5 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Images</h2>
            <label className="grid gap-y-4 relative">
                <h2 className="text-xl font-semibold text-white">Thumbnail</h2>
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
                            {errors.thumbimageSource.message as string}
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
                                const convertedImage = (await convertToBase64(
                                    e.target.files![0]
                                )) as string;
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
                        }}
                        {...getInputPropsThumb()}
                    />
                </section>
            </label>
            <label className="grid gap-y-4 relative">
                <h2 className="text-xl font-semibold text-white">Cover</h2>
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
                            {errors.coverimageSource.message as string}
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
                                const convertedImage = (await convertToBase64(
                                    e.target.files![0]
                                )) as string;
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
                        }}
                        {...getInputPropsCover()}
                    />
                </section>
            </label>
        </div>
    );
};

const CollabSection = () => {
    const localProductEditContext = useContext(productEditContext);
    const { errors, register, setValue, watch, control } =
        localProductEditContext!;

    const collab_active = watch('collab_active') || false;

    const { append, remove, fields } = useFieldArray({
        name: 'collabs',
        control,
    });
    return (
        <section className="bg-white/5 rounded-lg p-6 shadow-lg grid gap-y-2">
            <h2 className="text-2xl font-semibold text-white mb-4">Collabs</h2>

            <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={collab_active}
                        onChange={(e) => {
                            setValue('collab_active', !collab_active, {
                                shouldDirty: true,
                                shouldValidate: true,
                            });
                        }}
                    />
                    <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-300">
                    Activate Collab
                </span>
            </label>
            {collab_active && (
                <Fragment>
                    {errors.collabs && errors.collabs['root'] && (
                        <div className="text-red-400 text-sm">
                            {errors.collabs['root']?.message as string}
                        </div>
                    )}
                    {errors.collabs && (
                        <div className="text-red-400 text-sm">
                            {errors.collabs.message as string}
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
                                            watch('collabs').map((e) => e.share)
                                        )}
                                    %
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                    <Button
                        buttonName="Add new member"
                        extraClasses={[`!w-full !bg-indigo-600`]}
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
    );
};

const SettingsSection = () => {
    return (
        <section className="bg-white/5 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
            <article className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                        Allow customers to pay whatever they want
                    </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                        Allow customers to leave Reviews
                    </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                        Show number of sales
                    </span>
                </label>
            </article>
        </section>
    );
};
