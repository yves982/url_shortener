import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {Link} from "../../../src/application/models/link";
import {UrlShortenerFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlShortenerFixture";
import {UrlExpanderFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlExpanderFixture";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";

const linkRepository = new SqliteLinkRepository()

beforeEach(async () => {
    await linkRepository.init()
    await linkRepository.empty()
})

it('should_provide_a_shorter_url_than_the_original', async() => {
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    
    const link: Link = new Link(fixture.url, linkRepository)
    const shortenedUrl = await link.shorten()
    expect(shortenedUrl.length).toBeLessThan(fixture.url.length)
})

it('should_finds_the_original_url_from_shortened_one', async () => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("shortenUrlUseCase/original_url_from_shortened_one.json")
    const linkRepository = new SqliteLinkRepository()
    await linkRepository.init()
    const link: Link = new Link(fixture.url, linkRepository)
    const shortUrl = await link.shorten();
    expect(await Link.expand(shortUrl, linkRepository)).toBe(link.originalUrl)
})
