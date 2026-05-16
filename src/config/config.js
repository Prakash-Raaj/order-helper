require('dotenv').config();

module.exports = {
    // openAIApiKey: process.env.OPENAI_API_KEY,
    targetGroup: process.env.TARGET_GROUP,
    messageLimit: process.env.MESSAGE_LIMIT || 500,
    modelName: 'llama3.1',
    collectionName: 'whatsapp_messages'
};