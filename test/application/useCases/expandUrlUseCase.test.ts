import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {OriginalLinkRetriever} from "../../../src/adapters/secondary/originalLinkRetriever";
import {LinkIdentifier} from "../../../src/adapters/secondary/linkIdentifier";
import {ShortenLinkUseCase} from "../../../src/application/useCases/shortenLinkUseCase";
import {ExpandLinkUseCase} from "../../../src/application/useCases/expandLinkUseCase";
import {UrlExpanderFixture} from "../../fixtures/application/useCases/expandUrlUseCase/urlExpanderFixture";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";
import {ILinkRepository} from "../../../src/application/adapters/secondary/repositories/iLinkRepository";
import {IEncoder} from "../../../src/application/adapters/secondary/iEncoder";
import {UriJsLinkValidator} from "../../../src/adapters/secondary/uriJsLinkValidator";
import {StatisticUpdater} from "../../../src/adapters/secondary/statisticUpdater";


const linkRepository: ILinkRepository = new SqliteLinkRepository()
const base62Encoder: IEncoder = new Base62Encoder()
const originalLinkRetriever = new OriginalLinkRetriever(linkRepository, base62Encoder)
const linkIdentifier = new LinkIdentifier(linkRepository, base62Encoder)
const linkValidator = new UriJsLinkValidator()
const statisticsUpdater = new StatisticUpdater(linkRepository, base62Encoder)

beforeEach(async () => {
    await linkRepository.init()
    await (linkRepository as SqliteLinkRepository).empty()
})

it('should_finds_the_original_url_from_shortened_one', async () => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("expandUrlUseCase/original_url_from_shortened_one.json")
    
    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier, linkValidator)
    const expandLinkUseCase = new ExpandLinkUseCase(originalLinkRetriever, statisticsUpdater)
    const shortenedUrl = await shortenUseCase.shortenLink(fixture.url)
    const expandedUrl = await expandLinkUseCase.expandLink(shortenedUrl)
    expect(expandedUrl).toBe(fixture.url)
})

it('expanding_link_should_update_its_statistics', async() => {
    const fixture: UrlExpanderFixture = await FixtureHelper.load<UrlExpanderFixture>("expandUrlUseCase/original_url_from_shortened_one.json")

    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier, linkValidator)
    const expandLinkUseCase = new ExpandLinkUseCase(originalLinkRetriever, statisticsUpdater)
    const shortenedUrl = await shortenUseCase.shortenLink(fixture.url)
    const expandedUrl = await expandLinkUseCase.expandLink(shortenedUrl)
    expect(expandedUrl).toBe(fixture.url)
    const link = await linkRepository.findById(base62Encoder.decode(shortenedUrl))
    expect(link?.clicksCnt ?? -1).toBe(1)
})
