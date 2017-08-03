const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');

const cheerio = require('cheerio');
const superagent = require('superagent');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = new Koa();
    const router = new Router();

    router.get('/about', async ctx => {
      const resp = await new Promise((resolve, reject) => {
        superagent.get('https://cnodejs.org').end(async(err, sres) => {
          if(err) {
            return reject(err);
          }
          let results = [];
          const $ = cheerio.load(sres.text);
          $('#topic_list .topic_title').each((idx, element) => {
            const $element = $(element);
            results.push({
              title: $element.attr('title'),
              href: `https://cnodejs.org${$element.attr('href')}`
            });
          });
          resolve(results);
        });
      });
      await app.render(ctx.req, ctx.res, '/about', {results: resp});
      ctx.respond = false;
    });

    router.get('*', async ctx => {
      await handle(ctx.req, ctx.res);
      ctx.respond;
    })

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    })

    server.use(router.routes())
    server.listen(3000, err => {})

  })