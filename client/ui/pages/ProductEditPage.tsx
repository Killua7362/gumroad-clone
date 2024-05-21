import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import ProductEditHomePage from "@/ui/pages/ProductEditHomePage";
import ProductEditContentPage from "@/ui/pages/ProductEditContentPage";
import { queryClient } from "@/app/RootPage";
import { singleProductFetcher } from "@/react-query/query"


const productEditPageProps = () => {
	const [editProductState, setEditProductState] = useState<ProductType>()
	return { editProductState, setEditProductState } as productEditPageProps
}

const ProductEditPage = () => {
	const navigate = useNavigate()
	const params = useParams()

	const [rendered, setRendered] = useState(false)
	const productState = productEditPageProps()

	const { data: currentProduct, isPending: productsIsLoading, isSuccess: productIsSuccess } = singleProductFetcher({ productId: params.id })

	useEffect(() => {
		if (!productsIsLoading) {
			if (productIsSuccess) {
				productState.setEditProductState({ ...currentProduct })
				setRendered(true)
			} else {
				navigate('/notfound')
			}
		}
	}, [params.id, productsIsLoading, currentProduct, productIsSuccess])

	return rendered && (
		<ProductEditPageLayout productState={productState}>
			{
				params.page === 'home' ?
					<ProductEditHomePage productState={productState} />
					:
					<ProductEditContentPage productState={productState} />
			}
		</ProductEditPageLayout>
	)
}

export default ProductEditPage
