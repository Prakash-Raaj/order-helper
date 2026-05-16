const client = require("./whatsapp/client")
const { initVectorStore } = require('./vectorstore/init');
const { loadGroupHistory } = require('./whatsapp/messageHandler');
const { askQuestion } = require('./rag/query');


client.on('ready', async ()=>{
    await initVectorStore();
    await loadGroupHistory(client);

    await askQuestion("who ordered banana?");
    // client.on('message', handleIncomingMessage)
})

client.initialize();