const { Document } = require('@langchain/core/documents');
const { addDocuments } = require('../vectorstore/store');
const { targetGroup } = require('../config/config');

// async function handleIncomingMessage(message) {
//     const chat = await message.getChat();

//     // only store messages from target group
//     if (!chat.isGroup || chat.name !== targetGroup) return;

//     const doc = new Document({
//         pageContent: message.body,
//         metadata: {
//             from: message.from,
//             timestamp: message.timestamp,
//             chatName: chat.name,
//             id: message.id._serialized
//         }
//     });

//     await addDocuments([doc]);
//     console.log(`Stored: "${message.body}" from ${message.from}`);
// }

async function loadGroupHistory(client) {
  const chats = await client.getChats();
  const group = chats.find(
    (c) => c.isGroup && c.name === targetGroup,
  );

  if (!group) {
    console.log('Group not found!');
    return;
  }

  const messages = await group.fetchMessages({ limit: 1200 });

  console.log(
    'Oldest message date:',
    new Date(messages[0].timestamp * 1000),
  );
  console.log(
    'Newest message date:',
    new Date(messages[messages.length - 1].timestamp * 1000),
  );

  const contactCache = new Map();
  const filtered = messages.filter((msg) => msg.body);

  const docs = await Promise.all(
    filtered.map(async (msg) => {
      const senderId = msg.author || msg.from;

      if (!contactCache.has(senderId)) {
        try {
          const contact = await msg.getContact();
          contactCache.set(
            senderId,
            contact.name ||
              contact.pushname ||
              contact.number ||
              senderId,
          );
        } catch {
          contactCache.set(senderId, senderId);
        }
      }

      return new Document({
        pageContent: msg.body,
        metadata: {
          from: senderId,
          senderName: contactCache.get(senderId),
          chatName: group.name,
          timestamp: msg.timestamp,
          id: msg.id._serialized,
        },
      });
    }),
  );

  await addDocuments(docs);

  console.log(`Loaded ${docs.length} messages from "${targetGroup}"`);
}

module.exports = { loadGroupHistory };
