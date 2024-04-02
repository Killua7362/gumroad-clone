import React, { useState, Fragment } from 'react';
import style from './global.module.css';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useParams,
	Navigate,
} from "react-router-dom";
import { RecoilRoot } from 'recoil'
import Home from '@/ui/pages/Home'
import BaseLayout from '@/ui/layouts/BaseLayout';
import NotFoundPage from '@/ui/pages/404';
import ProductsPage from '@/ui/pages/Products';
import CollaboratorsPage from '@/ui/pages/Collaborators';
import CheckoutPage from '@/ui/pages/Checkout';
import ProfileHomePage from '@/ui/pages/ProfileHomePage';
import ProductsDetailsPage from '@/ui/pages/ProductDetailsPage';
import ProfileCheckoutPage from '@/ui/pages/ProfileCheckoutPage';

const productsPageRoute = () => {
	const params = useParams();

	if (params.page && (params.page === 'home' || params.page === 'collaborators')) {
		return (
			<ProductsPage />
		)
	}

	return <Navigate to='/notfound' replace />
}

const checkoutPageRoute = () => {
	const params = useParams()
	if (params.page && (params.page === 'form' || params.page === 'suggestions')) {
		return (
			<CheckoutPage />
		)
	}
	return <Navigate to='/notfound' replace />
}

const RootPage = () => {
	return (
		<RecoilRoot>
			<Router>
				<BaseLayout>
					<Routes>
						<Route path='/' element={
							< Home />
						} />
						<Route path="/products/:page" Component={productsPageRoute} />
						<Route path="/checkout/:page" Component={checkoutPageRoute} />
						<Route path="/profile/:id" element={
							< ProfileHomePage />
						} />
						<Route path="/profile/:id/product" element={< ProductsDetailsPage />} />
						<Route path="/profile/:id/checkout" element={< ProfileCheckoutPage />} />
						<Route path='/notfound' element={< NotFoundPage />} />
						<Route path='*' element={<Navigate to='/notfound' replace />} />
					</Routes>
				</BaseLayout>
			</Router >
		</RecoilRoot>
	);
};

export default RootPage;
