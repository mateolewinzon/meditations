import {db} from './db.mjs'
import {currentCount, incrementCount} from './count.mjs'
import {postTweetsAsThread} from './api.mjs'
import {quoteToTweets} from './parse.mjs'



export async function handler(event, context){
  try {
    const {book, quote} = await currentCount()
    
    const text = db[book][quote]
   
    const tweets = quoteToTweets(text)
    
    await postTweetsAsThread(tweets)
    
    await incrementCount(book, quote)
  } catch (e) {
    console.error('The task was interrupted by an unexpected error: ', e)
  }

};
