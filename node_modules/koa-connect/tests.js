'use strict'

const Koa = require('koa')
const supertest = require('supertest')
const c2k = require('./index')
const assert = require('assert')

describe('koa-connect', () => {
  let app

  beforeEach(() => {
    app = new Koa()
    app.use((ctx, next) => {
      ctx.status = 404
      ctx.body = 'Original'
      return next()
    })
  })

  it('works with a single noop Connect middleware', (done) => {
    function noop(req, res, next) { next() }
    app.use(c2k(noop))
    supertest(app.callback())
      .get('/')
      .expect('Original')
      .end(done)
  })

  it('works with two noop Connect middleware', (done) => {
    function noop(req, res, next) { next() }
    app.use(c2k(noop))
    app.use(c2k(noop))
    supertest(app.callback())
      .get('/')
      .expect('Original')
      .end(done)
  })

  it('passes correctly to downstream Koa middlewares', (done) => {
    function noop(req, res, next) { next() }
    function goodStatusSetter(ctx) { ctx.status = 200 }
    app.use(c2k(noop))
    app.use(goodStatusSetter)
    supertest(app.callback())
      .get('/')
      .expect(200)
      .end(done)
  })

  it('bubbles back to earlier middleware', (done) => {
    let callOne = false
    let callTwo = false
    app.use((ctx, next) => {
      return next()
        .then(() => {
          callTwo = true
        })
    })

    app.use(c2k((req, res) => {
      res.statusCode = 200
      callOne = true
    }))

    supertest(app.callback())
      .get('/')
      .expect(200)
      .then(() => {
        assert(callOne === true, 'Second middleware never called')
        assert(callTwo === true, 'Never bubbled back to first middleware')
        done()
      })
  })

  it('receives errors from Connect middleware', (done) => {
    app.use((ctx, next) => {
      next().catch((err) => ctx.status = 505)
    })

    app.use(c2k((req, res, next) => {
      next(new Error('How Connect does error handling'))
    }))

    app.use((ctx) => {
      // Fail the test if this is reached
      done(new Error('Improper error handling'))
    })

    supertest(app.callback())
      .get('/')
      .expect(505)
      .end(done)
  })

  it('Setting the body or status in Koa middlewares does not do anything if res.end was used in a Connect middleware', (done) => {
    const message = 'The message that makes it'
    app.use((ctx, next) => {
      next()
        .then(() => {
          if ( ctx.status !== 200 ) {
            done(new Error('Never reached connect middleware'))
          }
          // These calls won't end up doing anything
          ctx.status = 500
          ctx.body = 'A story already written'
        })
    })

    app.use(c2k((req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Length', message.length)
      res.end(message)
    }))

    supertest(app.callback())
      .get('/')
      .expect(200)
      .expect(message)
      .end(done)
  })
})
