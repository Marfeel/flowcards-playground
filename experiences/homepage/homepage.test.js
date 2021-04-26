const { bootstrapExperience } = require('../../e2e/utils/bootstrap');
const { scrollTo, scrollBy } = require('../../e2e/utils/scroll');
const { touchCard } = require('../../e2e/utils/touch');
const { isAtSnapPoint } = require('../../e2e/utils/snapPoints');
const { isCardContentLoaded } = require('../../e2e/utils/cardContent');
const { scrollCard } = require('../../e2e/utils/card-actions/scroll');
const { removeCard: minimizeCard } = require('../../e2e/utils/card-actions/remove');
const { closeCard } = require('../../e2e/utils/card-actions/close');
const {
	triggerInfiniteScroll,
	isAttachedToEndOfPage
} = require('../../e2e/utils/infiniteScroll');
const { isCardExisting } = require('../../e2e/utils/card');
const { expect } = require('chai');
const { getUrlFixture } = require('../../e2e/utils/fixtureUrl');
const experience = require('./homepage.json');

const homepageTest = function() {
	let config,
		fixture;
	const fixtureUrl = getUrlFixture({
		siteUrl: 'https://playground.marfeel.com/templates/article-example.html',
		requestHostname: 'playground.marfeel.com',
		technology: 'web',
		experienceUrl: '/experiences/homepage/homepage.json'
	});

	it('setup', async function() {
		config = experience;
		fixture = {
			url: fixtureUrl,
			articleTitle: 'Article example'
		};

		await bootstrapExperience(browser, config, fixture);
	});

	it('card should render on scroll', async function() {
		await scrollTo(browser, 400);

		const cardExists = await isCardExisting(
			browser,
			config.cards.homepage.cardSelector
		);

		expect(cardExists).equal(true);
	});

	it('card should have right content', async function() {
		const rightContentLoaded = await isCardContentLoaded(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.content
		);

		expect(rightContentLoaded).equal(true);
	});

	it('card should be displayed in viewport at initial snap point', async() => {
		await scrollTo(browser, 800);

		const firstCard = await browser.$(config.cards.homepage.cardSelector);

		const firstCardIsInViewport = await firstCard.isDisplayedInViewport();

		expect(firstCardIsInViewport).equal(true);

		const isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.initial
		);

		expect(isAtInitialSnapPoint).equal(true);
	});

	it('activate card by click', async() => {
		await touchCard(browser, config.cards.homepage.cardSelector);

		const isAtActiveSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.active
		);

		expect(isAtActiveSnapPoint).equal(true);
	});

	it('close card pressing close button', async() => {
		await scrollCard(browser, config.cards.homepage.cardSelector, 400);

		await closeCard(browser);

		const isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.initial
		);

		expect(isAtInitialSnapPoint).equal(true);
	});

	it('card attaches to end of page for infinite scroll', async() => {
		if (config.cards.homepage.features.infiniteScroll) {
			await triggerInfiniteScroll(browser);

			const isSticky = await isAttachedToEndOfPage(
				browser,
				config.cards.homepage.cardSelector
			);

			expect(isSticky).equal(true);
		}
	});

	it('minimize card dragging it down when status is "initial"', async() => {
		if (!config.cards.homepage.features.removable) {
			// Restore initial status after infinite scroll
			await scrollBy(browser, -1800);
			await minimizeCard(browser, config.cards.homepage.cardSelector);

			const isAtMinimizedSnapPoint = await isAtSnapPoint(
				browser,
				config.cards.homepage.cardSelector,
				config.cards.homepage.snapPoints.minimised
			);

			expect(isAtMinimizedSnapPoint).equal(true);
		}
	});
};

describe('homepage experience', homepageTest);

exports.default = homepageTest;
