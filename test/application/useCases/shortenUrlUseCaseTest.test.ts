import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {Link} from "../../../src/application/models/link";
import {UrlShortenerFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlShortenerFixture";
import {UrlExpanderFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlExpanderFixture";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";

const linkRepository = new SqliteLinkRepository()
const base62Encoder = new Base62Encoder()

beforeEach(async () => {
    await linkRepository.init()
    await linkRepository.empty()
})

it('should_provide_a_shorter_url_than_the_original', async() => {
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    const link: Link = new Link(fixture.url, linkRepository, base62Encoder)
    const shortenedUrl = await link.shorten()
    expect(shortenedUrl.length).toBeLessThan(fixture.url.length)
})

it('should_finds_the_original_url_from_shortened_one', async () => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("shortenUrlUseCase/original_url_from_shortened_one.json")
    const linkRepository = new SqliteLinkRepository()
    await linkRepository.init()
    const link: Link = new Link(fixture.url, linkRepository, base62Encoder)
    const shortUrl = await link.shorten();
    expect(await Link.expand(shortUrl, linkRepository, base62Encoder)).toBe(link.originalUrl)
})

it('short_url_should_be_between_1_and_7_chars_long', async() => {
    // non functionnal requirement to ensure produced shortenedUrl are of reasonable length
    
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    const link: Link = new Link(fixture.url, linkRepository, base62Encoder)
    const shortenedUrl = await link.shorten()
    expect(shortenedUrl.length).toBeLessThan(7)
    expect(shortenedUrl.length).toBeGreaterThanOrEqual(1)
})
