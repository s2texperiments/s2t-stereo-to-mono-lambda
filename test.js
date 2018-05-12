
(async (event, context, callback) => {
    require('dotenv').config()
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    const writeFile = util.promisify(require('fs').writeFile);
    const readFile = util.promisify(require('fs').readFile);

    await writeFile(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`, Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON), { encoding: 'utf8' });

    const Storage = require('@google-cloud/storage');

    let result = await new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID
    }).bucket(process.env.BUCKET)
    .upload('package.json', {
        destination: process.env.DESTINATION,
        resumable: false
    });
})();
