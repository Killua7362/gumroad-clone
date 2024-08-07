import { currencyTypeOptions } from '@/forms/schema/misc_schema';
import { NewProductSchema } from '@/forms/schema/new_product_schema';
import {
    getProductCreater,
    NewProductSchemaType,
} from '@/react-query/mutations';
import Button from '@/ui/components/button';
import { FormInput } from '@/ui/components/forms';
import * as Modal from '@/ui/components/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { SelectComponent } from '../select';

const NewProductModal = () => {
    const {
        register,
        handleSubmit,
        trigger,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<NewProductSchemaType>({
        resolver: zodResolver(NewProductSchema),
    });

    const { mutate: productSetter, isPending: productIsSetting } =
        getProductCreater();
    const currency_code = watch('currency_code');

    return (
        <Modal.Root>
            <Modal.Base>
                <article>
                    <form
                        id="new_product_form"
                        className="bg-background border-white/30 rounded-xl w-[28rem] border-[0.1px] p-6 text-lg grid gap-y-6"
                        onSubmit={handleSubmit((data) => {
                            const payload: ProductType = {
                                title: data.name,
                                description: '',
                                summary: '',
                                price: data.price,
                                currency_code: 'USD',
                                tags: '',
                                live: false,
                                collab_active: false,
                                thumbimageSource: '',
                                coverimageSource: '',
                                collabs: [] as IndividualCollab[],
                            };
                            productSetter(payload);
                            reset();
                        })}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}>
                        <header>
                            <h2 className="uppercase text-xl">
                                Publish your product
                            </h2>
                        </header>
                        <main className="grid gap-y-4">
                            <section className="flex gap-x-6 items-center">
                                Name
                                <FormInput<NewProductSchemaType>
                                    name={`name`}
                                    register={register}
                                    errors={errors}
                                    placeholder={'Name'}
                                    type="text"
                                />
                            </section>
                            <section className="flex gap-x-7 items-center h-full">
                                Price
                                <FormInput<NewProductSchemaType>
                                    name={`price`}
                                    register={register}
                                    errors={errors}
                                    placeholder="Price"
                                    type="number">
                                    <SelectComponent
                                        placeholder="Enter Price..."
                                        options={currencyTypeOptions}
                                        value={{
                                            value: currency_code || 'USD',
                                            label: currency_code || 'USD',
                                        }}
                                        width="95px"
                                        onChange={(v) => {
                                            setValue(
                                                'currency_code',
                                                v?.value || 'USD',
                                                {
                                                    shouldDirty: true,
                                                }
                                            );
                                        }}
                                    />
                                </FormInput>
                            </section>
                        </main>
                        <footer className="w-full flex justify-end gap-x-4">
                            <Modal.Close>
                                <Button buttonName="Cancel" />
                            </Modal.Close>
                            <Modal.Close
                                onClickHandler={async () => {
                                    const status = await trigger();
                                    return status;
                                }}>
                                <Button
                                    buttonName="Save"
                                    isLoading={productIsSetting}
                                    type="submit"
                                    formID="new_product_form"
                                    onClickHandler={async () => {
                                        const form_status = await trigger();
                                        if (form_status) {
                                        }
                                    }}
                                />
                            </Modal.Close>
                        </footer>
                    </form>
                </article>
            </Modal.Base>
            <Modal.Open>
                <Button
                    extraClasses={['rounded-xl']}
                    buttonName="New Product"
                />
            </Modal.Open>
        </Modal.Root>
    );
};

export default NewProductModal;
