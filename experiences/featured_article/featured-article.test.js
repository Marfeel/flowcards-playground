const experience = require('./featured_article.json');
const { getUrlFixture } = require('../../e2e/utils/fixtureUrl');

const { test, doers, checkers } = require('../../e2e/tests');

const suite = function() {
	const fixture = {
		articleTitle: 'Article example',
		url: getUrlFixture({
			siteUrl: 'https://playground.marfeel.com/templates/article-example.html',
			technology: 'web',
			experienceUrl: '/experiences/featured_article/featured_article.json'
		})
	};

	test.with(experience)
		.bootstrap(fixture)
		.for('heroImage')
		.test('card should render on scroll', doers.scrollToTrigger('myScrollTrigger'), checkers.cardExists())
		.test('card should have right content', checkers.cardHasProperContent())
		.test('card should be displayed in viewport at initial snap point', doers.scrollViewport(), checkers.cardIsInViewport(), checkers.cardIsAtSnapPoint('initial'))
		.test('card should have a hero image', checkers.cardHasHeroImage())
		.test('card should activate on tap', doers.touchCard(), checkers.cardIsAtSnapPoint('active'))
		.test('card should be closed by tapping the close button', doers.scrollViewport(0.5), doers.touchCloseButton(), checkers.cardIsAtSnapPoint('initial'))
		.test('card should attach to body on infinite scroll', doers.triggerInfiniteScroll(), checkers.cardIsAttachedToEndOfPage())
};

describe('Featured article experience', suite);

exports.default = suite;
