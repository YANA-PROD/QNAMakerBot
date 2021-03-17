const express = require('express');
const fetch = require('node-fetch');
const successJson = require('./../response_json_files/succes.json');
const errorJson = require('./../response_json_files/error.json');
 
// Creating new express app  
const app = express();
 
// PORT configuration
const PORT = process.env.PORT || 2020;
 
// IP configuration
const IP = process.env.IP || 2021;
 
app.use(express.json())

// Create a route for the app
app.post('/', async (req, res) => {
 console.log("request body::" + JSON.stringify(req.body));
 input = req.body;
 let KBResponseObj = "";
 if(input)
    KBResponseObj = await getKBSearchResult(input.text);
 
 console.log("KBResponseText::" + JSON.stringify(KBResponseObj));

 let responseJSON = await getResponse(KBResponseObj, input);
 console.log("response JSON::" + JSON.stringify(responseJSON));

 res.send(responseJSON);
});
 
// Create a route other than / to give error message
app.get('*', (req, res) => {
 res.send('OOPS!! The link is broken...');
});
 
// Server listening to requests
app.listen(PORT, IP, () => {
 console.log(
`The Server is running`);
});

//Environment variables setting for running it on local

/*process.env.KB_SEARCH_URL = 'https://yana-qna.azurewebsites.net/qnamaker/knowledgebases/dec776bc-9f53-4828-b8ff-2c44627727a7/generateAnswer';
process.env.YANA_DEFAULT_TIMEOUT = '5000';
process.env.KB_AUTHORIZATION = 'EndpointKey ed438af1-b6ec-47fb-b2f4-1ec803c53808';
process.env.ENVIRONMENT_NAME = 'QNAMakerBot'
process.env.KB_SEARCH_MIN_SCORE = 70;*/

//Make a call to QNA maker using environment variables.
// It takes input JSON text property.
//Returns QNA maker response text
//if confidence is greater than or equal to 70 out of 0 to 100
async function getKBSearchResult(inputText) {
    const score = 'score';
    const answers = 'answers';
    const answer = 'answer';
    const question = 'question';
    const methodType = 'post';
    const contentType = 'application/json';

	try {
        var responseObj = {};
        var responseText = '';
        const response = await fetch(process.env.KB_SEARCH_URL, {method:methodType, 
            body:JSON.stringify({question:inputText}), 
            timeout: process.env.YANA_DEFAULT_TIMEOUT, 
            headers: {
                'Authorization': process.env.KB_AUTHORIZATION,
                'Content-Type': contentType 
            }
        });
           
        console.log("response from micro bot " + process.env.KB_SEARCH_URL + "::", response);

        var resultJson = await response.json();
        console.log("value of resultJson::" + JSON.stringify(resultJson));

        if(answers in resultJson && resultJson[answers].length > 0) {
            let firstResponse = resultJson[answers][0];

            console.log(firstResponse[score]);

            if(score in firstResponse && firstResponse[score] && firstResponse[score] >= process.env.KB_SEARCH_MIN_SCORE) {
                responseText = firstResponse[answer]
                responseObj.text = responseText;
                responseObj.source = firstResponse["source"];
            }
        }
    } catch(e) {
        console.log("error fetching results from KB");
        console.log(e);
    }
    
    console.log("responseText::" + responseText);
    return responseObj;
}

function getResponse(KBResponseObj, input) {
    console.log("Inside getResonse method" + KBResponseObj);
    let botJSONResponse;

    const applicationId= process.env.ENVIRONMENT_NAME

    if(KBResponseObj && KBResponseObj.text) {
        botJSONResponse = successJson;
        botJSONResponse.output.EN.text[0] = KBResponseObj.text;
        botJSONResponse.output.EN.voice = KBResponseObj.text;
        botJSONResponse.results.objects[0].CTX_RES_TEXT = KBResponseObj.text;
        botJSONResponse.results.objects[0].CTX_RES_VOICE = KBResponseObj.text;
        botJSONResponse.results.objects[0].CTX_RES_REF_URL = KBResponseObj.source;
    }
    else {
        botJSONResponse = errorJson;
    }

    botJSONResponse.applicationId = applicationId
    botJSONResponse.servedBy = applicationId;
    botJSONResponse.source = input.source;
    botJSONResponse.languageCode = input.languageCode;
    botJSONResponse.userId = input.userId;
    botJSONResponse.input = { 'text': input.text };
    botJSONResponse.context = input.context;
    botJSONResponse.MessageId = input.MessageId;

    console.log("returning response as::" + botJSONResponse);
    return botJSONResponse;
}