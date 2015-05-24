'use strict';

import * as fs from 'fs';
import * as cheerio from 'cheerio';

let url     = 'https://en.wikipedia.org/wiki/List_of_heads_of_state_of_Mexico',
    request = require('request'),
    data    = [];

function extractHeadOfState(el, $) {
  let text = $(el).text()
                  .replace(/^\n|\n$/gm, '');

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
          'dob': tryParse(/(\d{4})/m, text),
          'dod': tryParse(/(\d{4})\)/, text),
          'took_office': tryParse(/([a-z]+\s\d+,\s\d{4})\n([a-z]+\s\d+,\s\d{4}|Incumbent)/mi, text, 1),
          'left_office': tryParse(/[a-z]+\s\d+,\s\d{4}\n([a-z]+\s\d+,\s\d{4})$/mi, text, 1),
          'party': text
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


    fs.writeFile('presidents.json', JSON.stringify(data, null, 4), function(err){
        if (!err) {
  //        console.log(data);
          console.log('File successfully written! - Check your project directory for the presidents.json file');
        }
    });
    }
});
