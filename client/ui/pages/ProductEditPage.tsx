import { AllProdctsForUser } from "@/atoms/states";
import ProductEditPageLayout from "@/ui/layouts/ProductEditPageLayout"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import ProductEditHomePage from "@/ui/pages/ProductEditHomePage";
import ProductEditContentPage from "@/ui/pages/ProductEditContentPage";

const ProductEditPage = () => {
	const navigate = useNavigate()
	const params = useParams()
	const [rendered, setRendered] = useState(false)
	const allProducts = useRecoilValue(AllProdctsForUser)

	useEffect(() => {
		if (params.id && allProducts.some((e) => e.id === params.id)) {
			setRendered(true)
		} else {
			navigate('/notfound')
		}
	}, [params.id])

	return rendered && (
		<ProductEditPageLayout>
			{
				params.page === 'home' ?
					<ProductEditHomePage />
					:
					<ProductEditContentPage />
			}
		</ProductEditPageLayout>
	)
}

export default ProductEditPage
