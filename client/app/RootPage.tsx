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

const Test = () => {
	return (<div className=''>
	</div>)
}
const RootPage = () => {
	return (
		<RecoilRoot>
			<BaseLayout>
				<Router>
					<Routes>
						<Route path='/' Component={Home} />
						<Route path='/test' Component={Test} />
					</Routes>
				</Router >
			</BaseLayout>
		</RecoilRoot>
	);
};

export default RootPage;
