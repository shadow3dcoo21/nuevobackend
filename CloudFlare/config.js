const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    endpoint: 'https://069045a45a62f5eda7d68f9aa458dc57.r2.cloudflarestorage.com',
    accessKeyId: '6f2149bb3e2322026ba6f85c1b51027b',
    secretAccessKey: 'b730f7c10454ce7354cb6173b8d56fbc4cc202b710e980cdca32fa3313c70ed5',
    region: 'auto',
    signatureVersion: 'v4'
});

module.exports = s3;
