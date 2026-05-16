const {
  Chroma,
} = require('@langchain/community/vectorstores/chroma');
const { OllamaEmbeddings } = require('@langchain/ollama');
const { collectionName, modelName } = require('../config/config');

let vectorStore;

async function initVectorStore() {
  vectorStore = await Chroma.fromDocuments(
    [],
    new OllamaEmbeddings({ model: 'nomic-embed-text:latest' }),
    { collectionName },
  );
  console.log('Vector store ready');
}

function getVectorStore() {
  if (!vectorStore) throw new Error('Vector store not initialized');
  return vectorStore;
}

module.exports = { initVectorStore, getVectorStore };
