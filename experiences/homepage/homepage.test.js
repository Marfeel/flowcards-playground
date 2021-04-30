const { bootstrapExperience } = require('../../e2e/utils/bootstrap');
const { scrollTo, scrollToElement, scrollBy } = require('../../e2e/utils/scroll');
const { touchCard } = require('../../e2e/utils/touch');
const { isAtSnapPoint } = require('../../e2e/utils/snapPoints');
const { isCardContentLoaded } = require('../../e2e/utils/cardContent');
const { scrollCard } = require('../../e2e/utils/card-actions/scroll');
const { minimizeCard } = require('../../e2e/utils/card-actions/minimize');
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
		const pixels = config.cards.homepage.triggers.myScrollTrigger.spec.pixel;

		await scrollTo(browser, pixels);

		const cardExists = await isCardExisting(
			browser,
			config.cards.homepage.cardSelector,
			async()=>{
				await scrollTo(browser, 0);
				await scrollTo(browser, pixels);
			}
		);

		expect(cardExists).equal(true);
	});

	it('scroll bounded', async function() {
		//TODO implement utility to get current SnapPoint

		let currentSnapPoint = 623;
		const smallScrollPixels = 20;

		let isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			currentSnapPoint
		);

		expect(isAtInitialSnapPoint).equal(true);

		// First 60px transitioner doesn't made the card appear
		await scrollBy(browser, 60);
		isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			currentSnapPoint
		);

		expect(isAtInitialSnapPoint).equal(true);

		await scrollBy(browser, smallScrollPixels);
		currentSnapPoint -= smallScrollPixels;
		isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			currentSnapPoint
		);

		expect(isAtInitialSnapPoint).equal(true);

		await scrollBy(browser, 20);
		currentSnapPoint -= smallScrollPixels;
		isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			currentSnapPoint
		);

		expect(isAtInitialSnapPoint).equal(true);
	});

	it('card should be displayed in viewport at initial snap point', async() => {
		await scrollTo(browser, 600);

		const cardExists = await isCardExisting(
			browser,
			config.cards.homepage.cardSelector
		);

		expect(cardExists).equal(true);

		const isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.initial
		);

		expect(isAtInitialSnapPoint).equal(true);
	});

	it('card should get promoted at certain element', async() => {
		await scrollToElement(browser, config.cards.homepage.triggers.myIntersectionTrigger.spec.selector);

		const cardExists = await isCardExisting(
			browser,
			config.cards.homepage.cardSelector
		);

		expect(cardExists).equal(true);

		const isAtPromotedSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.promoted
		);

		expect(isAtPromotedSnapPoint).equal(true);
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
				config.cards.homepage.cardSelector,
				async() => {
					await scrollBy(browser, 50);
				}
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
