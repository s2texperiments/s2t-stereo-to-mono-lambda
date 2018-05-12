# Lambda Function which transcode stereo opus file to mono and transfer it to Google Cloud Storage
## Prerequiste
 - Add static ffmpeg binaries to /ffmpeg/

### Optional
- Node >=8 installed (tests)
- zip as cli tool installed (build.sh)

## Expected Incoming Data
```
{
    "title":"data",
    "type": "string"
    "$comment" : "Base64 encoded String"
}
```

## ENV

```
BUCKET=Bucketname on Google Cloud Storage (GCS)
DESTINATION=Name where the generated artefact will be stored on GCS  
GOOGLE_APPLICATION_CREDENTIALS=Path where credentials will be stored. Default: /tmp/credentials.json
GOOGLE_APPLICATION_CREDENTIALS_JSON=Outh2 Credentials for GCS
GOOGLE_PROJECT_ID=ProjectId for GCS 
```

## Test

Add a .env file to the root folder und run npm test to test your GCS connection.