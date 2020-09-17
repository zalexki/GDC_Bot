const handleError = (ex) => console.error("error", ex.code, ex.errno, ex);
const canSendMessage = process.env.DEV_MODE !== "true";

const isDevMode = (message) => {
  if (canSendMessage) return false;
  console.log("DevMode:", message);
  return true;
};

const maxLengthSecurity = async (content, callback) => {
  const messages = [];
  for (let i = 0, charsLength = content.length; i < charsLength; i += 2000) {
    messages.push(await callback(content.substring(i, i + 2000)));
  }
  return messages;
};

exports.sendMessage = async (message, client, content) => {
  if (isDevMode(message)) return;
  return maxLengthSecurity(content, async (fragment) =>
    // console.log('sendMesage', fragment);
    client.channels.get(message.channel.id).send(fragment).catch(handleError)
  );
};

exports.replaceMessage = async (message, client, content) => {
  if (isDevMode(message)) return;
  message.delete().catch(handleError);

  return maxLengthSecurity(content, async (fragment) => {
    console.log("replaceMessage", fragment);
    return client.channels
      .get(message.channel.id)
      .send(fragment)
      .catch(handleError);
  });
};

exports.replyAndReplaceMessage = async (message, content) => {
  if (isDevMode(message)) return;
  message.delete().catch(handleError);

  return maxLengthSecurity(content, async (fragment) => {
    console.log("replyMessage", fragment);
    return message.reply(fragment).catch(handleError);
  });
};

exports.replyMessage = async (message, content) => {
  if (isDevMode(message)) return;
  return maxLengthSecurity(content, async (fragment) => {
    console.log("replyMessage", fragment);
    return message.reply(fragment).catch(handleError);
  });
};

exports.deleteMessage = async (message) => {
  if (isDevMode(message)) return;
  message.delete().catch(handleError);
};
