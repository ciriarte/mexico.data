var fs      = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    url     = 'https://en.wikipedia.org/wiki/List_of_heads_of_state_of_Mexico',
    data    = [];


request(url, function(error, response, html){
    if(!error) {
        var $    = cheerio.load(html);

		function extractHeadOfState(i, tr) {
			var children = $(this).children();

			function tryParse(exp, str) {
				try {
					return exp.exec(str)[0];
				}
				catch (err) {
					console.log(err);
				}
				return null;
			}

			try {
				var row = {
			        "name": tryParse(/\D+$/m, $(children[2]).text()),
			        "dob": tryParse(/(\d{4})/m, $(children[2]).text()),
			        "dod": tryParse(/(\d{4})\)/, $(children[2]).text()),
			        "took_office": $(children[3]).text(),
			        "left_office": $(children[4]).text(),
			        'party': $(children[5]).text()
			    };
			    data.push(row);
		    }
			catch (err) {
				console.log(err);
			}
		}

		$('.wikitable').each(function() {
			$(this)
	    	.find('tr:not(:first-child)')
	    	.each(extractHeadOfState);
		});

		fs.writeFile('presidents.json', JSON.stringify(data, null, 4), function(err){
			console.log(data);
		    console.log('File successfully written! - Check your project directory for the presidents.json file');
		})
    }
});