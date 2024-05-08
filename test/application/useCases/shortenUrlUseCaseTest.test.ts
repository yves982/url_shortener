import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";

it('should provide a shorter url than the original one', async() => {
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original_one.json")
    const link: Link = new Link(fixture.url)
    expect(link.shorten().length).toBeLessThan(fixture.url.length)
})
