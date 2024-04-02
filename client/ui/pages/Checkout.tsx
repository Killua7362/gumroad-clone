import CheckoutLayout from "@/ui/layouts/CheckoutLayout"
import { useParams } from "react-router"
import CheckoutForm from "@/ui/pages/CheckoutForm"
import SuggestionsPage from "@/ui/pages/Suggestions"

const CheckoutPage = () => {
	const params = useParams()
	return (
		<CheckoutLayout>
			{
				params.page && params.page === 'form' ?
					<CheckoutForm />
					:
					<SuggestionsPage />

			}
		</CheckoutLayout>
	)
}

export default CheckoutPage
