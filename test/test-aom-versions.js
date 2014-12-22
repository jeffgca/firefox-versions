var aom = require('../index');
var assert = require('assert');

it('tests getting aom versions via phantom', function(done) {
  aom.fetchAomVersions(function(err, result) {
    var firefox = result[0];
    assert.equal(firefox.guid, aom.app_ids.FIREFOX);
    assert.equal(firefox.versions[0], '0.3');
    done();
  });
});

it('tests fetching latest firefox version', function() {
  aom.fetchFirefoxLatest(function(err, result) {
    if (err) throw err;
    var keys = Object.keys(result);
    assert.equal(keys[0], 'firefox');
  });
});

it('tests fetching latest full version results', function() {
  aom.fetch(function(err, result) {
    if (err) throw err;
    var keys = Object.keys(result);
    assert.equal(keys[0], 'firefox');
    assert.equal(keys[4], 'aom_max');
  });
});
