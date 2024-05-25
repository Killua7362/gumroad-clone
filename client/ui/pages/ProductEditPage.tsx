import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import { useEffect, useState, createContext } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import ProductEditHomePage from "@/ui/pages/ProductEditHomePage";
import ProductEditContentPage from "@/ui/pages/ProductEditContentPage";
import { queryClient } from "@/app/RootPage";
import { singleProductFetcher } from "@/react-query/query"
import { getEditProductFormProps } from "@/forms";
import { z } from 'zod'
import { EditProductSchema } from "@/forms/schema/edit_product_schema"


export const productEditContext = createContext<ReactFormProps<EditProductSchemaType> | null>(null)

const ProductEditPage = () => {
	const navigate = useNavigate()
	const params = useParams()

	const [rendered, setRendered] = useState(false)

	const { data: currentProduct, isPending: productsIsLoading, isSuccess: productIsSuccess } = singleProductFetcher({ productId: params.id })

	const productEditProps = getEditProductFormProps({ ...currentProduct })

	useEffect(() => {
		if (!productsIsLoading) {
			if (productIsSuccess) {
				productEditProps.reset({ ...currentProduct })
				setRendered(true)
			} else {
				navigate('/notfound')
			}
		}
	}, [params.id, productsIsLoading, currentProduct, productIsSuccess])


	return rendered && (
		<productEditContext.Provider value={productEditProps}>
			{
				<ProductEditPageLayout>
					{
						params.page === 'home' ?
							<ProductEditHomePage />
							:
							<ProductEditContentPage />
					}
				</ProductEditPageLayout>
			}
		</productEditContext.Provider>
	)
}

export default ProductEditPage
