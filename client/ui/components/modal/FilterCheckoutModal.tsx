import { hideToastState } from '@/atoms/states';
import { filterTypeOptions } from '@/forms/schema/misc_schema';
import { CheckoutFormSchemaType } from '@/react-query/mutations';
import * as Modal from '@/ui/components/modal';
import { useState } from 'react';
import {
    UseFormResetField,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form';
import { FaClipboard } from 'react-icons/fa';
import { MdEdit, MdEditOff } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';
import Button from '../button';
import { SelectComponent } from '../select';

interface FilterCheckoutModal {
    watch: UseFormWatch<CheckoutFormSchemaType>;
    setValue: UseFormSetValue<CheckoutFormSchemaType>;
    i: number;
    resetField: UseFormResetField<CheckoutFormSchemaType>;
}

const FilterCheckoutModal = ({
    watch,
    setValue,
    i,
    resetField,
}: FilterCheckoutModal) => {
    const [tempURL, setTempURL] = useState(watch(`category.${i}.url`));
    const urlparams = new URLSearchParams(tempURL);

    const setToastRender = useSetRecoilState(hideToastState);
    return (
        <Modal.Root>
            <Modal.Base>
                <article
                    className="bg-background z-50 border-white/30 rounded-xl w-[30rem] relative border-[0.1px] p-6 text-lg flex flex-col gap-y-4 m-[2rem]"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <header>
                        <h2>Filter</h2>
                    </header>
                    <main></main>
                    <section className="flex justify-between items-center">
                        Sort by
                        <SelectComponent
                            placeholder="Sort by"
                            options={filterTypeOptions}
                            value={filterTypeOptions.filter(
                                (e) =>
                                    e.value ===
                                    (urlparams.get('sort_by') || 'title')
                            )}
                            onChange={(v) => {
                                urlparams.set('sort_by', v?.value || 'title');
                                setTempURL(urlparams.toString());
                            }}
                        />
                    </section>
                    <section className="flex justify-between items-center">
                        Product Count
                        <div className="flex h-full gap-x-2">
                            {urlparams.get('product_all') !==
                                true.toString() && (
                                <input
                                    type="number"
                                    className="text-lg rounded-lg bg-background text-white border-white/30 border-[0.1px] focus:border-white w-[5rem] px-3 py-1 outline-none"
                                    min="1"
                                    defaultValue={
                                        urlparams.get('product_count') || 1
                                    }
                                    onChange={(event) => {
                                        let count: number;
                                        if (
                                            Number(event.currentTarget.value) >=
                                            1
                                        ) {
                                            count = Number(
                                                event.currentTarget.value
                                            );
                                        } else {
                                            count = 1;
                                        }
                                        urlparams.set(
                                            'product_count',
                                            count.toString()
                                        );
                                        setTempURL(urlparams.toString());
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            (event.which < 48 ||
                                                event.which > 57) &&
                                            event.code !== 'Backspace'
                                        ) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            )}
                            <Button
                                buttonName="All"
                                isActive={
                                    urlparams.get('product_all') ===
                                    true.toString()
                                }
                                onClickHandler={() => {
                                    urlparams.set(
                                        'product_all',
                                        urlparams.get('product_all') ===
                                            true.toString()
                                            ? 'false'
                                            : 'true'
                                    );
                                    setTempURL(urlparams.toString());
                                }}
                                extraClasses={[`!w-[5.1rem]`]}
                            />
                        </div>
                    </section>
                    <section className="flex gap-4 flex-wrap">
                        <Button
                            buttonName=""
                            isActive={
                                urlparams.get('reverse') === true.toString()
                            }
                            onClickHandler={() => {
                                urlparams.set(
                                    'reverse',
                                    urlparams.get('reverse') === true.toString()
                                        ? 'false'
                                        : 'true'
                                );
                                setTempURL(urlparams.toString());
                            }}>
                            Reverse
                        </Button>
                        <Button
                            buttonName="Clear All"
                            onClickHandler={() => {
                                setTempURL('');
                            }}
                        />
                        <Button
                            buttonName="Revert"
                            onClickHandler={() => {
                                setTempURL(watch(`category.${i}.url`));
                            }}
                        />
                        <Button
                            buttonName="Default"
                            onClickHandler={() => {
                                setTempURL(
                                    'reverse=false&sort_by=title&edit_url=false&product_all=true&product_count=2'
                                );
                            }}
                        />
                    </section>
                    <section className="flex items-center gap-x-4">
                        <fieldset
                            className="border-white/30 border-[0.1px] min-h-[3.9rem] w-full rounded-md flex items-center px-4 text-white/60 break-all"
                            disabled={
                                urlparams.get('edit_url') !== true.toString()
                            }>
                            <input
                                type="text"
                                className={`bg-background outline-none ${urlparams.get('edit_url') === true.toString() ? 'text-white' : 'text-white/70'} h-full w-full`}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setTempURL(event.currentTarget.value);
                                }}
                                value={tempURL}
                            />
                            <legend className="text-xs text-white">URL</legend>
                        </fieldset>
                        {urlparams.get('edit_url') === true.toString() ? (
                            <MdEditOff
                                className="text-2xl text-white cursor-pointer"
                                onClick={() => {
                                    urlparams.set('edit_url', false.toString());
                                    setTempURL(urlparams.toString());
                                }}
                            />
                        ) : (
                            <MdEdit
                                className="text-2xl text-white cursor-pointer"
                                onClick={() => {
                                    urlparams.set('edit_url', true.toString());
                                    setTempURL(urlparams.toString());
                                }}
                            />
                        )}
                        <FaClipboard
                            className="text-xl cursor-pointer text-white"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(
                                        tempURL
                                    );
                                    setToastRender({
                                        active: false,
                                        message:
                                            'Copied url to clipboard succesfully',
                                    });
                                } catch (err) {
                                    setToastRender({
                                        active: false,
                                        message:
                                            'Error occured while copying to clipboard',
                                    });
                                }
                            }}
                        />
                    </section>
                    <footer className="flex gap-x-4 justify-end">
                        <Modal.Close>
                            <Button buttonName="Cancel" />
                        </Modal.Close>
                        <Modal.Close>
                            <Button
                                buttonName="Save"
                                onClickHandler={() => {
                                    setValue(`category.${i}.url`, tempURL, {
                                        shouldDirty: true,
                                    });
                                }}
                            />
                        </Modal.Close>
                    </footer>
                </article>
            </Modal.Base>
            <Modal.Open className="h-full grow">
                <Button
                    buttonName="Filter"
                    extraClasses={[`!w-[calc(100%-2rem)]`]}
                />
            </Modal.Open>
        </Modal.Root>
    );
};

export default FilterCheckoutModal;
