import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import ProductEditHomePage from "@/ui/pages/ProductEditHomePage";
import ProductEditContentPage from "@/ui/pages/ProductEditContentPage";
import { queryClient } from "@/app/RootPage";
import { singleProductFetcher } from "@/query";

const ProductEditPage = () => {
	const navigate = useNavigate()
	const params = useParams()

	const [rendered, setRendered] = useState(false)
	const [editProductState, setEditProductState] = useState<ProductType>()

	const { data: currentProduct, isPending: productsIsLoading, isSuccess: productIsSuccess } = singleProductFetcher({ productId: params.id })

	useEffect(() => {
		if (!productsIsLoading) {
			if (productIsSuccess) {
				setEditProductState({ ...currentProduct })
				setRendered(true)
			} else {
				navigate('/notfound')
			}
		}
	}, [params.id, productsIsLoading, currentProduct, productIsSuccess])

	return rendered && (
		<ProductEditPageLayout>
			{
				params.page === 'home' ?
					<ProductEditHomePage editProductState={editProductState!} setEditProductState={setEditProductState} />
					:
					<ProductEditContentPage />
			}
		</ProductEditPageLayout>
	)
}

export default ProductEditPage
