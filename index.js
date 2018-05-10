const fetch = require('node-fetch');

process.env.PATH = process.env.PATH + ':/tmp/';
process.env['FFMPEG_PATH'] = '/tmp/ffmpeg';
const BIN_PATH = process.env['LAMBDA_TASK_ROOT'];
process.env['PATH'] = process.env['PATH'] + ':' + BIN_PATH;

exports.handler = async(event, context, callback) => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    const writeFile = util.promisify(require('fs').writeFile);
    const readFile = util.promisify(require('fs').readFile);
    
    await exec(`cp /var/task/ffmpeg/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg;`);
    await exec(`mkdir /tmp/data`);
    await writeFile('/tmp/data/stereo.opus', Buffer.from(event.data,'base64'),{encoding: 'binary'});
    await exec('/tmp/ffmpeg -y -i /tmp/data/stereo.opus -acodec libopus -mode mono -ac 1 /tmp/data/mono.opus');
    const post = await readFile('/tmp/data/mono.opus');
    
    let respone = await fetch(`https://www.googleapis.com/upload/storage/v1/b/${process.env.BUCKET}${process.env.FILENAME}`, {
        method: 'POST',
        body: post,
        headers: {
            'Content-Type': 'audio/webm;codecs=pcm'
        }
    }).then((response) => response.json());

    callback(null, googleResponse);
};
