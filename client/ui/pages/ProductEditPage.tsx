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

	const { data: currentProductData, error: productErrors, isPending: productsIsLoading, isSuccess: productIsSuccess } = useQuery({
		queryKey: ['allProducts', params.id!],
		queryFn: () => {
			if (queryClient.getQueryData(['allProducts'])) {
				return (queryClient.getQueryData(['allProducts']) as ProductTypePayload)[params.id!]
			} else {
				return fetch(`${window.location.origin}/api/products/${params.id!}`).then(async (res) => {
					if (!res.ok) {
						const errorMessage: string = await res.json().then(data => data.error);
						return Promise.reject(new Error(errorMessage));
					}
					return res.json().then(data => {
						const { id, ...temp } = { ...data.data.attributes, id: '' }
						return temp;
					});
				})
			}
		},
		meta: { persist: true },
		enabled: !!params.id,
	})

	const currentProduct = useMemo(() => {
		return { ...currentProductData as ProductType }
	}, [currentProductData])

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
