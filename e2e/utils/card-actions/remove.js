const { dragCardTo } = require('../touch');

const removeCard = async(browser, cardSelector) => {
	const height = await browser.executeAsync(async(args, done) => {
		const windowHeight = window.screen.height;

		done(windowHeight);
	}, '');

	await dragCardTo(browser, cardSelector, height-5);
};

module.exports = {
	removeCard
};
