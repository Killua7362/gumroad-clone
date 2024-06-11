import { LinkProps } from "@tanstack/react-router";

//max number of urls per component
const LIMIT = 100;

//stores history of pages by sidebar urls
class BrowserHistory {
	homepages: Map<string, LinkProps[]>;

	constructor(homepages: LinkProps[]) {
		this.homepages = new Map<string, LinkProps[]>;

		for (const page of homepages) {
			const props: LinkProps = page;
			this.homepages.set(this.getKey(props.to!), [props])
		}
	}

	//used to add url to the component history
	setURL({ to, search }: LinkProps) {
		const prevPages: LinkProps[] = this.homepages.get(this.getKey(to as string))!

		if (!prevPages) return

		if (prevPages[prevPages.length - 1].to === to) {
			let lastPage: LinkProps[] = this.homepages.get(this.getKey(to as string))!
			lastPage[lastPage.length - 1].search = search
			this.homepages.set(this.getKey(to as string), [...lastPage])
		} else {
			this.homepages.set(this.getKey(to as string), [...(prevPages.length > LIMIT ? [prevPages[0]] : prevPages), { to, search }])
		}
	}

	//get latest url from the component history
	getURL(to: string) {
		const arr: LinkProps[] = this.homepages.get(this.getKey(to))!
		if (!arr) return location.pathname
		const res: LinkProps = arr[arr.length - 1]
		return ((res.to! === location.pathname) ? arr[0]! : res) as LinkProps
	}

	//get name of the componenet
	getKey(url: string) {
		const key: string = url.split('/')[1] || '/';
		return key;
	}

	isActive(url: string) {
		return this.getKey(location.pathname) === this.getKey(url)
	}

}

const browserHistory = new BrowserHistory([
	{ to: '/home', search: {} },
	{
		to: '/products/home',
		search: {
			sort_by: 'title',
			reverse: false,
			search_word: ''
		}
	},
	{ to: '/checkout/form', search: {} }
]
)

export default browserHistory
