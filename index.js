process.env.PATH = process.env.PATH + ':/tmp/';
process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = process.env['GOOGLE_APPLICATION_CREDENTIALS'] ? process.env['GOOGLE_APPLICATION_CREDENTIALS'] : '/tmp/credentials.json'
const BIN_PATH = process.env['LAMBDA_TASK_ROOT'];
process.env['PATH'] = process.env['PATH'] + ':' + BIN_PATH;

exports.handler = async (event, context, callback) => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    const writeFile = util.promisify(require('fs').writeFile);
    const readFile = util.promisify(require('fs').readFile);

    await exec(`cp /var/task/ffmpeg/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`);
    await exec(`mkdir -p /tmp/data`);
    await writeFile('/tmp/data/stereo.opus', Buffer.from(event.data,'base64'),{encoding: 'binary'});
    await exec('/tmp/ffmpeg -y -i /tmp/data/stereo.opus -acodec libopus -mode mono -ac 1 /tmp/data/mono.opus');
 
    await writeFile(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`, Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON), { encoding: 'utf8' });
    const Storage = require('@google-cloud/storage');

    let response = await new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID
    }).bucket(process.env.BUCKET)
    .upload('/tmp/data/mono.opus', {
        destination: process.env.DESTINATION,
        resumable: false
    });
    
    callback(null, response);
};
