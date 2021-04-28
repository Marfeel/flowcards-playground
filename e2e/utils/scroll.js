/* eslint-disable no-console */
const { range } = require('mathjs');

const getCurrentScrollPosition = async(browser)=>{
	return await browser.executeAsync(async(arg, done) => {
		const htmlEl = document.querySelector('html');

		done(htmlEl.scrollTop);
	}, '');
};

const scroll = async(browser, y) => {
	return await browser.executeAsync(async(yBrowser, done) => {
		const html = document.querySelector('html');

		html.scroll(0, yBrowser);
		html.dispatchEvent(new CustomEvent('scroll', {}));
		done(html.scrollLeft === 0 && html.scrollTop === yBrowser);
	}, y);
};

const scrollTo = async(browser, y, step=50)=>{
	const currentScrollPosition = await getCurrentScrollPosition(browser);
	const scrollArray = range(currentScrollPosition, y, step, true)._data;

	await scrollArray.reduce((prev, value)=>{
		return prev.then(()=>{
			scroll(browser, value);

			return new Promise(resolve => setTimeout(resolve, 100));
		});
	}, Promise.resolve());
};

const scrollBy = async(browser, y)=>{
	return await browser.executeAsync(async(yBrowser, done) => {
		const html = document.querySelector('html');

		html.scrollBy(0, yBrowser);
		html.dispatchEvent(new CustomEvent('scroll', {}));
		done();
	}, y);
};

const scrollToElement = async(browser, selector)=>{
	return await browser.executeAsync(async(selectorBrowser, done) => {
		const element = document.querySelector(selectorBrowser);

		element.scrollIntoView();
		done();
	}, selector);
};

module.exports = {
	scrollTo,
	scrollBy,
	scrollToElement
};
