import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import ProductEditHomePage from "@/ui/pages/ProductEditHomePage";
import ProductEditContentPage from "@/ui/pages/ProductEditContentPage";
import { useQuery, useQueryClient } from "@tanstack/react-query";


const ProductEditPage = () => {
	const navigate = useNavigate()
	const params = useParams()
	const queryClient = useQueryClient()

	const [rendered, setRendered] = useState(false)
	const [editProductState, setEditProductState] = useState<ProductType>()

	const { data: allProductsData, error: productErrors, isLoading: productsIsLoading } = useQuery({
		queryKey: ['allProducts'],
	})
	const allProducts = useMemo(() => {
		return { ...allProductsData as ProductTypePayload }
	}, [allProductsData])

	useEffect(() => {
		if (params.id && params.id in allProducts) {
			setEditProductState({ ...allProducts[params.id] })
			setRendered(true)
		} else {
			navigate('/notfound')
		}
	}, [params.id])

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
