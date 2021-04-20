const { bootstrapExperience } = require('../../e2e/utils/bootstrap');
const { scrollTo } = require('../../e2e/utils/scroll');
const { touchCard } = require('../../e2e/utils/touch');
const { isAtSnapPoint } = require('../../e2e/utils/snapPoints');
const { isCardContentLoaded } = require('../../e2e/utils/cardContent');
const { expect } = require('chai');
const { getUrlFixture } = require('../../e2e/utils/fixtureUrl');
const experience = require('./push_notifications.json');

const pushNotificationTest = function() {
	let config,
		fixture;
	const fixtureUrl = getUrlFixture({
		siteUrl: 'https://playground.marfeel.com/templates/article-example.html',
		requestHostname: 'playground.marfeel.com',
		technology: 'web',
		experienceUrl: '/experiences/push_notifications/push_notifications.json'
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

		const firstCard = await browser.$(
			config.cards.pushNotifications.cardSelector
		);

		const firstCardExists = await firstCard.waitForExist({ timeout: 5000 });

		expect(firstCardExists).equal(true);
	});

	it('card should have right content', async function() {
		const rightContentLoaded = await isCardContentLoaded(
			browser,
			config.cards.pushNotifications.cardSelector,
			config.cards.pushNotifications.content
		);

		expect(rightContentLoaded).equal(true);
	});

	it('card should be displayed in viewport at initial snap point', async() => {
		await scrollTo(browser, 800);

		const firstCard = await browser.$(
			config.cards.pushNotifications.cardSelector
		);

		const firstCardIsInViewport = await firstCard.isDisplayedInViewport();

		expect(firstCardIsInViewport).equal(true);

		const isAtInitialSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.pushNotifications.cardSelector,
			config.cards.pushNotifications.snapPoints.initial
		);

		expect(isAtInitialSnapPoint).equal(true);
	});

	it('activate card by click', async() => {
		await touchCard(browser, config.cards.pushNotifications.cardSelector);

		const isAtActiveSnapPoint = await isAtSnapPoint(
			browser,
			config.cards.pushNotifications.cardSelector,
			config.cards.pushNotifications.snapPoints.active
		);

		expect(isAtActiveSnapPoint).equal(true);
	});
};

describe('push_notifications experience', pushNotificationTest);

exports.default = pushNotificationTest;
