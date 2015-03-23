var request = require('request');
var BASE_URI = 'https://svn.mozilla.org/libs/product-details';
var FIREFOX_PATH = BASE_URI+'/json/firefox_versions.json';
var AMO_URL = 'https://addons.mozilla.org/en-US/firefox/pages/appversions/';
var phantom = require('phantom');
var _ = require('underscore');
var async = require('async');

var app_ids = {
  FIREFOX: "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
  MOZILLA: "{86c18b42-e466-45a9-ae7a-9b95ba6f5640}",
  SUNBIRD: "{718e30fb-e89b-41dd-9da7-e25a45638b28}",
  SEAMONKEY: "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}",
  FENNEC: "{aa3c5121-dab2-40e2-81ca-7ea25febc110}",
  THUNDERBIRD: "{3550f703-e582-4d05-9a08-453d09bdfdc6}"
};

exports.app_ids = app_ids;

function fetchAomVersions(callback) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.includeJs('http://underscorejs.org/underscore-min.js');
      page.open(AMO_URL, function (status) {
        page.evaluate(function () {
          var list = document.querySelectorAll('.appversion ul');
          var data = _.map(list, function(ul) {
            var _guid = ul.childNodes[1].textContent.split(': ').pop();
            var _versions = ul.childNodes[3].textContent.split(': ').pop().split(', ');
            
            return { 
              guid: _guid, 
              versions: _versions,
              latest_version: _versions[_versions.length-1]
            };
          });
          return data;
        }, function (result) {
          callback(null, result);
          ph.exit();
        });
      });
    });
  });
}

exports.fetchAomVersions = fetchAomVersions;

function fetchFirefoxLatest(callback) {
  request.get(FIREFOX_PATH, function(err, result, body) {
    if (err) throw err;
    var versions = JSON.parse(result.body);

    if (versions.FIREFOX_AURORA) {
      var likely_nightly = parseInt(versions.FIREFOX_AURORA) + 1;
    }
    callback(null, {
      firefox: versions.LATEST_FIREFOX_VERSION,
      beta: versions.LATEST_FIREFOX_RELEASED_DEVEL_VERSION,
      aurora: versions.FIREFOX_AURORA,
      nightly: likely_nightly+".0a1"
    });
  });
}

exports.fetchFirefoxLatest = fetchFirefoxLatest;

function fetch(callback) {
  async.parallel({
      firefox: fetchFirefoxLatest,
      aom: fetchAomVersions
    },
    function(err, result) {
      var _ret = result.firefox;
      var aom_max = _.map(result.aom, function(app) {
        if (app.guid === app_ids.FIREFOX) {
          // console.log("matched", app);
          return app.latest_version;
        }
      });

      _ret.aom_max = aom_max.shift();
      callback(null, _ret);
    }
  );
}

exports.fetch = fetch;

if (!module.parent) {
  // ??
  fetch(function(e, r) {
    console.log(r);
  });
}
