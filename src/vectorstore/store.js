const { getVectorStore } = require('./init');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,       // max characters per chunk
    chunkOverlap: 50      // overlap between chunks to preserve context
});

async function addDocuments(docs) {
    const vectorStore = getVectorStore();

    // split documents before storing
    const splitDocs = await splitter.splitDocuments(docs);

    await vectorStore.addDocuments(splitDocs);
    console.log(`Stored ${splitDocs.length} chunks`);
}

module.exports = { addDocuments };