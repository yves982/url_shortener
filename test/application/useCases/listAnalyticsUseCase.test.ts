import {ILinkRepository} from "../../../src/application/adapters/secondary/repositories/iLinkRepository";
import {SqliteLinkRepository} from "../../../src/adapters/secondary/repositories/sqliteLinkRepository";
import {IEncoder} from "../../../src/application/adapters/secondary/iEncoder";
import {Base62Encoder} from "../../../src/adapters/secondary/base62Encoder";
import {OriginalLinkRetriever} from "../../../src/adapters/secondary/originalLinkRetriever";
import {LinkIdentifier} from "../../../src/adapters/secondary/linkIdentifier";
import {UriJsLinkValidator} from "../../../src/adapters/secondary/uriJsLinkValidator";
import {StatisticUpdater} from "../../../src/adapters/secondary/statisticUpdater";
import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {ShortenLinkUseCase} from "../../../src/application/useCases/shortenLinkUseCase";
import {ExpandLinkUseCase} from "../../../src/application/useCases/expandLinkUseCase";
import {LinkStatistic} from "../../../src/application/models/linkStatistic";
import {ListAnalyticsUseCase} from "../../../src/application/useCases/listAnalyticsUseCase";
import {ListAnalyticsFixture} from "../../fixtures/application/useCases/listAnalyticslUseCase/listAnalyticsFixture";

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
    const fixture: ListAnalyticsFixture = await FixtureHelper.load<ListAnalyticsFixture>("listAnalyticslUseCase/toto.json")
    const shortenUseCase = new ShortenLinkUseCase(linkIdentifier, linkValidator)
    const expandUseCase = new ExpandLinkUseCase(originalLinkRetriever, statisticsUpdater)
    const shortenedUrls = await Promise.all<string>(fixture.newLinks.map((link: string) => shortenUseCase.shortenLink(link)))
    await expandUseCase.expandLink(shortenedUrls[2])
    await expandUseCase.expandLink(shortenedUrls[3])
    await expandUseCase.expandLink(shortenedUrls[3])
    
    const listAnalyticsUseCase = new ListAnalyticsUseCase(linkRepository, base62Encoder)
    const analytics : LinkStatistic[] = await listAnalyticsUseCase.listAnalytics()
    expect(analytics.length).toBe(fixture.newLinks.length)
    expect(analytics.map(a => a.originalUrl).filter((url) => fixture.newLinks.indexOf(url) === -1)).toHaveLength(0)
    expect(fixture.newLinks.filter(link => analytics.map(a => a.originalUrl).indexOf(link) === -1)).toHaveLength(0)
    expect(analytics[2].clicksCnt).toBe(1)
    expect(analytics[3].clicksCnt).toBe(2)
})
