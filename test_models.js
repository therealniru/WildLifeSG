const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoding key here since I can't easily import from Config.ts in a standalone JS script without ts-node
const genAI = new GoogleGenerativeAI('AIzaSyABuAkdsu8-6VAkqBVXIIEgxUNo__ABEgc');

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey;
        // Wait, getGenerativeModel doesn't list models. SDK usually has a ModelService.
        // Actually, strictly speaking, the JS SDK might not expose listModels directly on the main instance easily in older docs, 
        // but let's check if there's a manager.
        // Checking documentation style:
        // It seems strict listing might require a different REST call or looking at the error message more closely.
        // BUT, let's try a standard list if possible or just test `gemini-pro-vision`.

        // Actually, best way to list is usually via the genAI instance if supported?
        // looking at typical usage:
        // currently there is no direct `genAI.listModels()`. 
        // I will try to infer or just try `gemini-1.5-flash-latest`.
        console.log("Listing models is not directly supported by this helper script easily without types.");
    } catch (e) {
        console.log(e);
    }
}

// Let's just try to instantiate a few and see if they throw immediately? No, they only throw on generation.
// I'll try to generate content with 'gemini-1.5-flash-latest' to see if it works.

async function testModel(modelName) {
    try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`Success with ${modelName}`);
        console.log(result.response.text());
    } catch (e) {
        console.log(`Failed ${modelName}: ${e.message}`);
    }
}

async function run() {
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-flash-latest');
    await testModel('gemini-1.5-flash-001');
    await testModel('gemini-pro-vision'); // for images
}

run();
