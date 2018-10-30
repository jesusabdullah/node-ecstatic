'use strict';

const test = require('tap').test;
const ecstatic = require('../lib/ecstatic');
const express = require('express');
const http = require('http');
const request = require('request');
const path = require('path');

const root = `${__dirname}/public`;
const baseDir = '/base';

test('url encoding in href', (t) => {
  const port = Math.floor((Math.random() * ((1 << 16) - 1e4)) + 1e4);
  const uri = `http://localhost:${port}${path.join('/', baseDir, 'show-dir%24%24href_encoding%24%24')}`;

  const server = http.createServer(
    express().use(baseDir, ecstatic({
      root,
      showDir: true,
      autoIndex: false,
    }))
  );

  server.listen(port, () => {
    request.get({
      uri,
    }, (err, res, body) => {
      t.match(body, /href="\/base\/show-dir%24%24href_encoding%24%24\/aname%2Baplus.txt"/, 'We found the right href');
      server.close();
      t.end();
    });
  });
});
