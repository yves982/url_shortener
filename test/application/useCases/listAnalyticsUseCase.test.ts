import {ILinkRepository} from "../../../src/application/adapters/secondary/repositories/iLinkRepository";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {IEncoder} from "../../../src/application/adapters/secondary/iEncoder";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";
import {OriginalLinkRetriever} from "../../../src/adapters/secondary/originalLinkRetriever";
import {LinkIdentifier} from "../../../src/adapters/secondary/linkIdentifier";
import {UriJsLinkValidator} from "../../../src/adapters/secondary/uriJsLinkValidator";
import {StatisticUpdater} from "../../../src/adapters/secondary/statisticUpdater";
import {UrlShortenerFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlShortenerFixture";
import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {ShortenLinkUseCase} from "../../../src/application/useCases/shortenLinkUseCase";
import {ExpandLinkUseCase} from "../../../src/application/useCases/expandLinkUseCase";
import {Link} from "../../../src/application/models/link";

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

it('should list proper analytics', async () => {
    const fixture: ListAnalyticsFixture = await FixtureHelper.load<ListAnalyticsFixture>("listAnalyticslUseCase/shorter_url_than_the_original.json")
    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier, linkValidator)
    const expandUseCase = new ExpandLinkUseCase(originalLinkRetriever, statisticsUpdater)
    const shortenedUrls = await Promise.all<string>(fixture.newLinks.map((link: string) => shortenUseCase.shortenLink(link)))
    await expandUseCase.expandLink(shortenedUrls[2])
    await expandUseCase.expandLink(shortenedUrls[3])
    await expandUseCase.expandLink(shortenedUrls[3])
    
    const listAnalyticsUseCase = new ListAnalyticsUseCase(linkRepository)
    const analytics : Link[] = await listAnalyticsUseCase.listAnalytics()
    expect(analytics.length).toBe(fixture.newLinks.length)
    for(let i = 0; i < analytics.length; i++) {
        expect(analytics[i].originalUrl).toBe(fixture.newLinks[i])
    }
    expect(analytics[2].clicksCnt).toBe(1)
    expect(analytics[3].clicksCnt).toBe(2)
})
