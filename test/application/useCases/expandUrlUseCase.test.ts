import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {OriginalLinkRetrieve} from "../../../src/adapters/secondary/originalLinkRetrieve";
import {LinkIdentifier} from "../../../src/adapters/secondary/linkIdentifier";
import {ShortenLinkUseCase} from "../../../src/application/useCases/shortenLinkUseCase";
import {ExpandLinkUseCase} from "../../../src/application/useCases/expandLinkUseCase";
import {UrlExpanderFixture} from "../../fixtures/application/useCases/expandUrlUseCase/urlExpanderFixture";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";


const linkRepository = new SqliteLinkRepository()
const base62Encoder = new Base62Encoder()

beforeEach(async () => {
    await linkRepository.init()
    await linkRepository.empty()
})

it('should_finds_the_original_url_from_shortened_one', async () => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("expandUrlUseCase/original_url_from_shortened_one.json")
    const originalLinkRetriever = new OriginalLinkRetrieve(linkRepository, base62Encoder)
    const linkIdentifier = new LinkIdentifier(linkRepository, base62Encoder)
    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier)
    const expandLinkUseCase = new ExpandLinkUseCase(originalLinkRetriever)
    const shortenedUrl = await shortenUseCase.shortenLink(fixture.url)
    const expandedUrl = await expandLinkUseCase.expandLink(shortenedUrl)
    expect(expandedUrl).toBe(fixture.url)
})
