import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {Link} from "../../../src/application/models/link";
import {UrlShortenerFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlShortenerFixture";
import {UrlExpanderFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlExpanderFixture";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";
import {ShortenLinkUseCase} from "../../../src/application/useCases/shortenLinkUseCase";
import {OriginalLinkRetrieve} from "../../../src/adapters/secondary/originalLinkRetrieve";
import {LinkIdentifier} from "../../../src/adapters/secondary/linkIdentifier";
import {ExpandLinkUseCase} from "../../../src/application/useCases/expandLinkUseCase";

const linkRepository = new SqliteLinkRepository()
const base62Encoder = new Base62Encoder()

beforeEach(async () => {
    await linkRepository.init()
    await linkRepository.empty()
})

it('should_provide_a_shorter_url_than_the_original', async() => {
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    const linkIdentifier = new LinkIdentifier(linkRepository, base62Encoder)
    const useCase = new ShortenLinkUseCase(linkIdentifier)
    const shortenedUrl = await useCase.shortenLink(fixture.url)
    expect(shortenedUrl.length).toBeLessThan(fixture.url.length)
})

it('should_finds_the_original_url_from_shortened_one', async () => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("shortenUrlUseCase/original_url_from_shortened_one.json")
    const originalLinkRetriever = new OriginalLinkRetrieve(linkRepository, base62Encoder)
    const linkIdentifier = new LinkIdentifier(linkRepository, base62Encoder)
    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier)
    const expandLinkUseCase = new ExpandLinkUseCase(originalLinkRetriever)
    const shortenedUrl = await shortenUseCase.shortenLink(fixture.url)
    const expandedUrl = await expandLinkUseCase.expandLink(shortenedUrl)
    expect(expandedUrl).toBe(fixture.url)
})

it('short_url_should_be_between_1_and_7_chars_long', async() => {
    // non functionnal requirement to ensure produced shortenedUrl are of reasonable length

    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    const linkIdentifier = new LinkIdentifier(linkRepository, base62Encoder)
    const useCase = new ShortenLinkUseCase(linkIdentifier)
    const shortenedUrl = await useCase.shortenLink(fixture.url)
    expect(shortenedUrl.length).toBeLessThan(7)
    expect(shortenedUrl.length).toBeGreaterThanOrEqual(1)
})
