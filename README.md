# Firefox Versions

A simple, probably stupid module that returns a hash containing the following things:

* current shipping Firefox version
* currently shipping Beta version
* currently shipping Firefox Developer Edition ( aka 'aurora' )
* likely Nightly version
* current maximum version usable on AMO. If you want your add-on to be compatible with any pre-release version of Firefox, use this version.

### Install

`npm install firefox-versions`

### Use

    var fxVersions = require('firefox-versions');
    fxVersions.fetch(function(err, result) {
        if (err) throw err;
        console.log(result.firefox); // currently returns "34.0.5"
    });

### Sample data

    { 
        firefox: '34.0.5',
        beta: '35.0b4',
        aurora: '36.0a2',
        nightly: '37.0a1',
        aom_max: '38.0' 
    }

