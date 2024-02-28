import https from 'https'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

const CONSUMER_KEY =  process.env.X_API_KEY
const CONSUMER_SECRET = process.env.X_API_KEY_SECRET
const ACCESS_KEY = process.env.X_API_ACCESS_TOKEN
const ACCESS_SECRET = process.env.X_API_ACCESS_TOKEN_SECRET

export async function postTweetsAsThread(pieces) {
    let lastId

    for (const piece of pieces) {
        lastId = await postTweet(piece, lastId)
    }
}

async function postTweet(text, replyingTo = false){

  const oauth = OAuth({
    consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
        },
    })

    const token = {
        key: ACCESS_KEY,
        secret: ACCESS_SECRET
    }

    const url = 'https://' + process.env.X_API_HOSTNAME + process.env.X_API_PATH

    const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'POST' }, token));

    const options = {
        hostname: process.env.X_API_HOSTNAME,
        path: process.env.X_API_PATH,
        port: 443,
        method: 'POST',
        headers: {
              Authorization: authHeader["Authorization"],
              'user-agent': "v2CreateTweetJS",
              'content-type': "application/json",
              'accept': "application/json"
        }
     }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data)
                    resolve(response.data.id);
                } catch (err) {
                    reject(new Error(err));
                }
            });
        });

        req.on('error', (error) => {
            console.error('An error occurred while making the request to the Twitter API');
            
            reject(error);
        });


        const body = { text, ...(replyingTo ? { reply: { in_reply_to_tweet_id: replyingTo } } : {}) };
      
        
        const payload = JSON.stringify(body)

        req.write(payload);
        req.end();
})}

