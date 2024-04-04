# Aurelius Meditations X/Twitter Bot

https://twitter.com/meditations_bot

This is an X (formerly Twitter) automated bot built on AWS. It uses AWS Lambda for serverless execution and DynamoDB to store the bot's state. 

## What it does 
- Consumes a DynamoDB table to get the current quote and book number from Marcus Aurelius' meditations (starting at [0, 0])
- Gets the full quote from a static "db" file.
- Parses the quote into an array of tweet-sized strings. 
- Using X's API v2, iterates through the array and posts the segments as a thread
- Updates the count in the DynamoDb Table

## How to use it
- Download the code and upload it to your Lambda Function
- In order to use the Oauth dependency, you need to add a Layer to your Lambda. Follow this example: https://www.linkedin.com/pulse/aws-lambda-how-create-nodejs-layer-axios-michel-bluteau-6jkqe/ (do `npm i oauth-1.0a`)
- Upload the Layer and apply it to the function
- Add a schedule/cron Event trigger, or whatever trigger you want.
- To use a DynamoDB table in your function, create a Policy for the Table resource with the permissions you want (read, write, or simply "*"), and attach it to the function's execution Role.  


