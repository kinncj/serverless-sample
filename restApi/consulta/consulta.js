import $       from 'cheerio';
import request from 'request';

export default class Consulta
{
    constructor(termo, cb, cache)
    {
        this.cb    = cb;
        this.cache = cache;
        this.termo = termo;

        let entry = this.cache.get(termo);

        if (entry) {
            console.log("Cache found for: " + termo);

            cb(null, entry);
            return;
        }

        request.get({
            "url": `http://dados.gov.br/dataset?q=${termo}`,
            "encoding": null
        }, this.scrape.bind(this));
    }

    scrape(error, response, html) {
        if (error) {
            console.log('errorCB:', this.cb(error));
            throw error;
        }

        let parsed = $.load(html),
            links  = [];

        parsed('#content > div.wrapper > div > section:nth-child(1) > div > ul > li > .dataset-content').map(function(i, data) {
            links.push({
                'text':   $(this).find('div').text(),
                'header': $(this).find('a').text(),
                'link':   $(this).find('a').attr('href')
            });
        });

        this.cache.set(this.termo, links);

        console.log('successCB:', this.cb(null, links));
    }

    static create(event, cb, cache)
    {
        new Consulta(event.query, cb, cache);
    }
}
