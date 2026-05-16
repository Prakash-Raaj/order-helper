const { ChatOllama } = require('@langchain/ollama');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables');
const { getVectorStore } = require('../vectorstore/init');
const { modelName } = require('../config/config');

const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the following context:
{context}

Question: {question}
`);

async function askQuestion(question) {
  const llm = new ChatOllama({ model: modelName });
  const retriever = getVectorStore().asRetriever(20);


  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(docs => docs.map(d => `[${d.metadata.senderName || d.metadata.from}]: ${d.pageContent}`).join('\n\n')),
      question: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke(question);
  console.log('Answer:', result);
  return result;
}

module.exports = { askQuestion };
