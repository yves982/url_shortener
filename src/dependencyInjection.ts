import Bottle from "bottlejs";
import {Base62Encoder} from "./adapters/secondary/base62Encoder";
import {UriJsLinkValidator} from "./adapters/secondary/uriJsLinkValidator";
import {LinkIdentifier} from "./adapters/secondary/linkIdentifier";
import {OriginalLinkRetriever} from "./adapters/secondary/originalLinkRetriever";
import {SqliteLinkRepository} from "./adapters/secondary/repositories/sqliteLinkRepository";
import {ShortenLinkUseCase} from "./application/useCases/shortenLinkUseCase";
import {ExpandLinkUseCase} from "./application/useCases/expandLinkUseCase";
import {ListAnalyticsUseCase} from "./application/useCases/listAnalyticsUseCase";
import {StatisticUpdater} from "./adapters/secondary/statisticUpdater";

const bottle = new Bottle()
bottle.service("IEncoder", Base62Encoder)
bottle.service("ILinkValidator", UriJsLinkValidator)
bottle.service("ILinkIdentifier", LinkIdentifier, "ILinkRepository", "IEncoder")
bottle.service("IOriginalLinkRetriever", OriginalLinkRetriever, "ILinkRepository", "IEncoder")
bottle.service("IStatisticUpdater", StatisticUpdater, "ILinkRepository", "IEncoder")
bottle.service("ILinkRepository", SqliteLinkRepository)
bottle.service("ShortenLinkUseCase", ShortenLinkUseCase, "ILinkIdentifier", "ILinkValidator")
bottle.service("ExpandLinkUseCase", ExpandLinkUseCase, "IOriginalLinkRetriever", "IStatisticUpdater")
bottle.service("ListAnalyticsUseCase", ListAnalyticsUseCase, "ILinkRepository", "IEncoder")

export default bottle.container
export const $bottle = bottle

declare module "bottlejs" {
    // Use the same module name as the import string
    interface IContainer {
        ShortLinkUseCase: ShortenLinkUseCase,
        ExpandLinkUseCase: ExpandLinkUseCase,
        ListAnalyticsUseCase: ListAnalyticsUseCase
    }
}
