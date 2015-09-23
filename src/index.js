'use strict';

import pg from 'pg';
import * as cheerio from 'cheerio';

let url     = 'https://en.wikipedia.org/wiki/List_of_heads_of_state_of_Mexico',
    request = require('request'),
    data    = [];

function extractHeadOfState(el, $) {
  let text = $(el).text()
                  .replace(/^\n|\n$/gm, ''),
      img  = $(el).find('img').attr('src') || '';
  img = img.replace('thumb/', '');
  img = img.substring(0, img.lastIndexOf('/'));
  function tryParse(exp, str, idx) {
    idx = idx || 0;
    try {
      let result = exp.exec(str);
      if (result) {
        return result[idx];
      }
    }
    catch (err) {
      console.log(err);
    }
    return null;
  }

  try {
    let row = {
          'name': tryParse(/\D+$/m, text),
          'dob': tryParse(/\((\d{4})/m, text, 1),
          'dod': tryParse(/(\d{4})?\)/, text, 1),
          'img': 'https:' + img,
          'took_office': tryParse(/([a-z]+\s\d+,\s\d{4})\n([a-z]+\s\d+,\s\d{4}|Incumbent)/mi, text, 1),
          'left_office': tryParse(/[a-z]+\s\d+,\s\d{4}\n([a-z]+\s\d+,\s\d{4})$/mi, text, 1),
          'party': tryParse(/[a-z]+\s\d+,\s\d{4}\n[a-z]+\s\d+,\s\d{4}\n(\D+)\n/mi, text, 1)
      };
      data.push(row);
    }
  catch (err) {
    console.log(err);
  }
}

request(url, function(error, response, html){
    if(!error) {
        let $ = cheerio.load(html);

      $('.wikitable:not(:last-of-type)').each(function() {
        $(this)
         .find('tr:not(:first-child)')
         .each(function() { extractHeadOfState(this, $); });
      });

      let connectionString = 'postgres://postgres:5432@localhost/postgres',
                    client = new pg.Client(connectionString);

      client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      data.each(function() {
        client.query('SELECT NOW() AS "theTime"', function(qErr, result) {
          if(qErr) {
            return console.error('error running query', qErr);
          }
          console.log(result.rows[0].theTime);
          client.end();
        });
      });
    });
    }
});
