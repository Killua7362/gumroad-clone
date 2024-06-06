interface HistorySchema {
	[key: string]: string[];
}

class BrowserHistory {
	homepages: Map<string, string[]>;

	constructor(homepages: string[]) {
		this.homepages = new Map<string, string[]>;

		for (const page of homepages) {
			this.homepages.set(this.getKey(page), [page])
		}
	}

	setURL(url: string) {
		const prevPages: string[] = this.homepages.get(this.getKey(url))!
		if (!prevPages) return
		this.homepages.set(this.getKey(url), [...prevPages, url])
	}

	getURL(url: string) {
		const arr: string[] = this.homepages.get(this.getKey(url))!
		if (!arr) return location.pathname
		const res: string = arr[arr.length - 1]
		if (res === location.pathname) {
			return arr[0]!
		} else {
			return res
		}
	}

	getKey(url: string) {
		const key: string = url.split('/')[1] || '/';
		return key;
	}

	isActive(url: string) {
		return this.getKey(location.pathname) === this.getKey(url)
	}

	clear() {
		for (const key in this.homepages) {
			const page: string[] = this.homepages.get(key)!
			if (!page) return
			this.homepages.set(key, [page[0]])
		}
	}
}

const browserHistory = new BrowserHistory(['/home', '/products/home', '/checkout/form'])

export default browserHistory