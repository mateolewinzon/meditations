/**
 * Takes a quote and returns an array of valid-length tweets.
 */
export  function quoteToTweets(quote){
    const length = quote.length
    
    if (length <= 280) {
        return [quote]
    }
    
   const sentences = quote.match( /[^\.!\?]+[\.!\?]+/g )

   const threadTweets = []
    let combineSegments = ''
          
    sentences.forEach((sentence)=>{
        const length = sentence.length

        
        if (length <= 280) {
            threadTweets.push(sentence.trim())
        } else {
            const sentenceSegments = sentence.split(', ');
            
            for (let i=0; i < sentenceSegments.length; i++) {
                const section = sentenceSegments[i].trim()
                
                const potentialCombinedSegments = combineSegments + (i > 0 ? ', ': combineSegments ? ' ' : '') + section
                const potentialWithinLimit = potentialCombinedSegments.length < 280
                
                if (potentialWithinLimit) {
                    combineSegments = potentialCombinedSegments    

                } else {
                    threadTweets.push(combineSegments+',')
                    combineSegments = section
                    
                }
            }
     

        }
        
    })
    
    threadTweets.push(combineSegments)
  
    return threadTweets
}
