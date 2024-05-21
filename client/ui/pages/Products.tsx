import ProductLayout from "@/ui/layouts/ProductsLayout"
import ProductCard from "@/ui/components/cards/ProductCard"
import { Fragment } from "react/jsx-runtime"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState } from "recoil";

import ProductsHomePage from "@/ui/pages/ProductsHomePage";
import CollaboratorsPage from "./Collaborators";
import { useLocation, useParams } from "react-router";

const ProductsPage = () => {
	const params = useParams()

	return (
		<ProductLayout>
			{
				params.page && params.page === 'collaborators' ?
					<Suspense>
						<CollaboratorsPage />
					</Suspense>
					:
					<Suspense>
						<ProductsHomePage />
					</Suspense>
			}
		</ProductLayout>
	)
}

export default ProductsPage
