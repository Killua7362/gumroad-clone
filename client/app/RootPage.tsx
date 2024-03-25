import React, { useState, Fragment } from 'react';
import style from './global.module.css';
import {
	BrowserRouter as Router,
	Route,
	Routes
} from "react-router-dom";
import { RecoilRoot } from 'recoil'
import Home from '@/ui/pages/Home'
import BaseLayout from '@/ui/layouts/BaseLayout';
import NotFoundPage from '@/ui/pages/404';
import ProductsPage from '@/ui/pages/Products';

const RootPage = () => {
	return (
		<RecoilRoot>
			<Router>
				<BaseLayout>
					<Routes>
						<Route path='/' Component={Home} />
						<Route path='/products' Component={ProductsPage} />
						<Route path='*' Component={NotFoundPage} />
					</Routes>
				</BaseLayout>
			</Router >
		</RecoilRoot>
	);
};

export default RootPage;
