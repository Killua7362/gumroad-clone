import { z } from "zod"
import { EditProductSchema } from "./schema/edit_product_schema"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

type EditProductSchemaType = z.infer<typeof EditProductSchema>

export const getEditProductFormProps = () => {
	const [editProductState, setEditProductState] = useState<ProductType>()

	const {
		register,
		handleSubmit,
		setError,
		control,
		reset,
		setValue,
		watch,
		formState: { errors }
	} = useForm<EditProductSchemaType>({
		resolver: zodResolver(EditProductSchema),
		defaultValues: {
			title: editProductState?.title,
			description: editProductState?.description,
			summary: editProductState?.summary,
			price: editProductState?.price,
			collabs: editProductState?.collabs,
			tags: editProductState?.tags,
			contents: editProductState?.contents
		},
		shouldUnregister: false
	})

	const allFormStates = useWatch({
		control
	})

	return { handleSubmit, errors, register, setValue, reset, setError, watch, control, allFormStates, editProductState, setEditProductState } as EditPageFormProps<EditProductSchemaType>
}
