const { bootstrapExperience } = require("../../tests/utils/bootstrap");
const { scrollTo } = require("../../tests/utils/scroll");
const { touchCard, dragCardBy } = require("../../tests/utils/touch");
const { isAtSnapPoint } = require("../../tests/utils/snapPoints");
const { hasRightContentLoaded } = require("../../tests/utils/cardContent");
const { expect } = require('chai');
const { getUrlFixture } = require('../../tests/utils/fixtureUrl');
const experience = require('./homepage.json');

describe("homepage experience", function () {
	let config, fixture;
	const fixtureUrl = getUrlFixture({
		siteUrl: 'https://playground.marfeel.com/templates/article-example.html',
		requestHostname: 'playground.marfeel.com',
		technology: 'web',
		experienceUrl: '/experiences/homepage/homepage.json',
	})

	it("setup", async function () {
		config = experience;
		fixture = {
			url: fixtureUrl,
			articleTitle: 'Article example',
		}

		await bootstrapExperience(browser, config, fixture);
	});

	it("card should render on scroll", async function () {
		await scrollTo(browser, 400)

		const firstCard = await browser.$(config.cards.homepage.cardSelector);

		const firstCardExists = await firstCard.waitForExist({ timeout: 5000 });

		expect(firstCardExists).equal(true);
	});

	it("card should have right content", async function () {
		const rightContentLoaded = await hasRightContentLoaded(browser, 
			config.cards.homepage.cardSelector,
			config.cards.homepage.content);

		expect(rightContentLoaded).equal(true)
	});

	it("card should be displayed in viewport at initial snap point", async ()=>{
		await scrollTo(browser, 800)

		const firstCard = await browser.$(config.cards.homepage.cardSelector);

		const firstCardIsInViewport = await firstCard.isDisplayedInViewport();

		expect(firstCardIsInViewport).equal(true);

		const isAtInitialSnapPoint = await isAtSnapPoint(browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.initial)

		expect(isAtInitialSnapPoint).equal(true);
	});

	it("minimise card and should be at minimised snap point", async ()=>{
 		await dragCardBy(browser, config.cards.homepage.cardSelector, 200)

		const isAtMinimisedSnapPoint = await isAtSnapPoint(browser,
			config.cards.homepage.cardSelector,
			config.cards.homepage.snapPoints.minimised)

		expect(isAtMinimisedSnapPoint).equal(true);
	});

	it("activate card by click", async ()=>{
		await touchCard(browser, config.cards.homepage.cardSelector)

		let isAtActiveSnapPoint = await isAtSnapPoint(browser,
				config.cards.homepage.cardSelector,
				config.cards.homepage.snapPoints.active)
	   expect(isAtActiveSnapPoint).equal(true);
   });
});
