'use strict';

const semverGt = require('semver/functions/gt');
const request = require('httpreq');

/**
 * @type {Promise<Object|Boolean>}
 */
module.exports = getUpdatesMeta;
module.exports.extractUpdateMeta = extractUpdateMeta;


/**
 * Return promise which can return false if there are no updates available
 * or object which contains the update information
 * @param {string} updatesUrl
 * @param {string} build Something like win32, nsis, lin64
 * @param {string} channel prod, beta, dev and so on
 * @param {string} version 0.0.1
 * @returns {Promise<Object|Boolean>}
 */
function getUpdatesMeta(updatesUrl, build, channel, version) {
  return getJson(updatesUrl)
    .then(meta => extractUpdateMeta(meta, build, channel, version));
}

function extractUpdateMeta(updatesMeta, build, channel, version) {
  const meta = updatesMeta[`${build}-${channel}`];
  if (!meta || !meta.version) {
    return false;
  }

  if (semverGt(meta.version, version)) {
    return meta;
  }

  return false;
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, response) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        resolve(JSON.parse(response.body));
      } catch (e) {
        reject(new Error(
          `Error while parsing '${url}'. ${e}. Data:\\n ${response.body}`
        ));
      }
    });
  });
}
