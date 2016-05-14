import $       from 'cheerio';
import request from 'request';

export default class Consulta
{
    constructor(term, cb, cache)
    {
        this.cb    = cb;
        this.cache = cache;
        this.term  = term;

        let entry = this.cache.get(term);

        if (entry) {
            cb(null, entry);

            return;
        }

        request.get({
            "url": `http://dados.gov.br/dataset?q=${term}`,
            "encoding": null
        }, this.scrape.bind(this));
    }

    scrape(error, response, html) {
        if (error) {
            this.cb(error);
            throw error;
        }

        let parsed = $.load(html),
            links  = [];

        parsed('#content > div.wrapper > div > section:nth-child(1) > div > ul > li > .dataset-content')
        .each(function(i, data) {
            links.push({
                "text":   $(this).find('div').text(),
                "header": $(this).find('a').text(),
                "link":   $(this).find('a').attr('href')
            });
        });

        this.cache.set(this.term, links);
        this.cb(null, links);
    }

    static create(event, cb, cache)
    {
        new Consulta(event.query, cb, cache);
    }
}
