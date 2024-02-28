import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {db} from './db.mjs'

const dynamo = DynamoDBDocument.from(new DynamoDB());

export async function currentCount(){
    try {
        const data = await dynamo.scan({ TableName: 'meditations' })
        const {book, quote} = data.Items[0]
        
        return {book, quote} 
    } catch (error) {
        console.error('An error occurred when obtaining the current count')
        
        throw error
    }
  
}

function getNextValues(book, quote){
    let updatedBook = book;
    let updatedQuote = quote;

    const bookCompleted = typeof db[book][quote+1] === 'undefined';
    const allCompleted = bookCompleted && book === 11;

    if (allCompleted) {
        updatedQuote = 0;
        updatedBook = 0;
    } else { 
        if (bookCompleted) {
            updatedQuote = 0;
            updatedBook++;
        } else {
            updatedQuote++;
        }
    }
    
    return {updatedBook, updatedQuote}
}

export async function incrementCount(book, quote) {
    const {updatedBook, updatedQuote} = getNextValues(book, quote) 
    
    try {
        await dynamo.update({
                TableName: 'meditations',
                Key: {
                    "meditations":"count"
                },
                UpdateExpression: 'SET #bookAttr = :bookValue, #quoteAttr = :quoteValue',
                ExpressionAttributeNames: {
                    '#bookAttr': 'book',
                    '#quoteAttr': 'quote'
                },
                ExpressionAttributeValues: {
                    ':bookValue': updatedBook,
                    ':quoteValue': updatedQuote
                },
       
            });
    } catch (error) {
        console.error('An error occurred when incrementing count');
        
        throw error;
    }
}