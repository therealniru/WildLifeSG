const https = require('https');

const API_KEY = 'AIzaSyABuAkdsu8-6VAkqBVXIIEgxUNo__ABEgc';

function listModels() {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models?key=${API_KEY}`,
        method: 'GET',
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.models) {
                    console.log('Available Gemini models:');
                    response.models.forEach(model => {
                        if (model.name.includes('gemini') && model.supportedGenerationMethods.includes('generateContent')) {
                            console.log(`- ${model.name}`);
                        }
                    });
                } else {
                    console.log('No models found or error:', JSON.stringify(response, null, 2));
                }
            } catch (e) {
                console.error('Error parsing response:', e);
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
}

listModels();
