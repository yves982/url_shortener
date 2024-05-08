﻿import {FixtureHelper} from "../../fixtures/helpers/fixtureHelper";
import {Link} from "../../../src/application/models/link";
import {UrlShortenerFixture} from "../../fixtures/application/useCases/shortenUrlUseCase/urlShortenerFixture";

it('should_provide_a_shorter_url_than_the_original', async() => {
    const fixture: UrlShortenerFixture = await FixtureHelper.load<UrlShortenerFixture>("shortenUrlUseCase/shorter_url_than_the_original.json")
    const link: Link = new Link(fixture.url)
    expect(link.shorten().length).toBeLessThan(fixture.url.length)
})
