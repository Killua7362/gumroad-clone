import {
  CheckoutFormSchemaType,
  EditProductSchemaType,
} from '@/react-query/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckoutFormSchema } from './schema/checkout_schema';
import { EditProductSchema } from './schema/edit_product_schema';

export const getEditProductFormProps = (editProductState: ProductType) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    setValue,
    watch,
    trigger,
    resetField,
    formState: { errors },
    getValues,
  } = useForm<EditProductSchemaType>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      title: editProductState?.title,
      description: editProductState?.description,
      summary: editProductState?.summary,
      currency_code: editProductState?.currency_code,
      price: editProductState?.price,
      collab_active: editProductState?.collab_active,
      collabs: editProductState?.collabs,
      tags: editProductState?.tags,
      contents: editProductState?.contents,
      thumbimageSource: editProductState?.thumbimageSource,
      coverimageSource: editProductState?.coverimageSource,
    },
    shouldUnregister: false,
  });

  return {
    handleSubmit,
    resetField,
    errors,
    register,
    setValue,
    reset,
    setError,
    watch,
    control,
    trigger,
    getValues,
  } as ReactFormProps<EditProductSchemaType>;
};

export const getCheckoutFormProps = (payload: CheckoutFormSchemaType) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    setValue,
    watch,
    trigger,
    resetField,
    formState: { errors, isDirty },
  } = useForm<CheckoutFormSchemaType>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      ...payload,
    },
    shouldUnregister: false,
  });

  return {
    handleSubmit,
    errors,
    register,
    resetField,
    setValue,
    reset,
    setError,
    watch,
    control,
    trigger,
    isDirty,
  } as ReactFormProps<CheckoutFormSchemaType>;
};
