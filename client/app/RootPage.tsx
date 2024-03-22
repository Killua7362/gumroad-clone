import React, { useState, Fragment } from 'react';
import style from './global.module.css';
import {
	BrowserRouter as Router,
	Route,
	Routes
} from "react-router-dom";
import { RecoilRoot } from 'recoil'

const Test1 = () => {
	return (
		<div>
			test1
		</div>
	)
}

const Test2 = () => {
	return (
		<div>
			test2
		</div>
	)
}

const RootPage = () => {
	return (
		<RecoilRoot>
			<Router>
				<Routes>
					<Route path='/' Component={Test1} />
					<Route path='/test' Component={Test2} />
				</Routes>
			</Router >
		</RecoilRoot>
	);
};

export default RootPage;
