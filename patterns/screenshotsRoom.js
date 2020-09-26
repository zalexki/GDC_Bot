const moment = require("moment");
const {
  sendMessage,
  replyMessage,
  deleteMessage,
} = require("../../utils/discord");

/*
  @const screenshotsAuthors Object
    authorId: {
      lastValidMessages: [Utc Date]
      nbWarning: Int
    }
*/
const screenshotsAuthors = {};
const timeBetweenMessage = 60 * 60 * 20; // 20 hours in seconds
// const IDChannelAdmin = '116601499177451524' // ADMIN for test!
const IDChannelScreenshots = "434310515762790430";

module.exports = (message, client) => {
  if (message.channel.id === IDChannelScreenshots) {
    if (hasImage(message)) {
      if (canSendMessage(message)) {
        updateLastValidMessage(message);
      } else {
        // console.log('Warning');
        handleWarning({ message, client });
      }
    }

    // console.log('Result: ', JSON.stringify(screenshotsAuthors));
  }
};

const hasImage = (message) =>
  (message.attachments && message.attachments.size > 0) ||
  /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\.(gif|jpe?g|tiff|png|webp|bmp|svg)(\?.*)?/i.test(
    message.content
  ) ||
  /steamuserimages\-a\.akamaihd\.net/i.test(message.content) ||
  /gph\.is/i.test(message.content) ||
  /tenor\.com/i.test(message.content) ||
  /giphy\.com/i.test(message.content) ||
  /imgur\.com/i.test(message.content);

const canSendMessage = (message) => {
  if (screenshotsAuthors[message.author.id]) {
    const { lastValidMessages } = screenshotsAuthors[message.author.id];
    const screenshotRole = message.guild.roles.find("name", "screenshoter");

    if (message.member.roles.has(screenshotRole.id) === true) {
      lastValidMessages.forEach(element, index => {
        const previousMoment = moment
          .utc(element)
          .add(timeBetweenMessage, "s");

        if (moment.utc().isBefore(previousMoment)) {
          if (index > 5) {
            // warn
          }
          if (index > 6) {
            lastValidMessages.splice(5, 1);
          }
        }

      });
      return true;
    }

    // Check if message is too soon
    const previousMoment = moment
      .utc(lastValidMessages[lastValidMessages.length])
      .add(timeBetweenMessage, "s");

    if (moment.utc().isBefore(previousMoment)) {
      return false;
    }
  }

  return true;
};

const updateLastValidMessage = (message) => {
  if (screenshotsAuthors[message.author.id]) {
    // Update, already exists
    screenshotsAuthors[message.author.id].lastValidMessages.push(moment.utc());
    screenshotsAuthors[message.author.id].nbWarning = 0;
  } else {
    // New author
    screenshotsAuthors[message.author.id] = {
      lastValidMessages: [moment.utc()],
      nbWarning: 0,
    };
  }
};

const handleWarning = ({ message, client }) => {
  const { nbWarning = 0, lastValidMessages } = screenshotsAuthors[
    message.author.id
  ];

  const diffSinceFirstImage = moment(lastValidMessages[lastValidMessages.length])
    .locale("fr")
    .fromNow(true);

  switch (nbWarning) {
    case 0:
      replyMessage(
        message,
        `/!\\ Une image par jour et par personne, la prochaine je la supprime, image de la journée envoyée il y a ${diffSinceFirstImage}`
      );
      break;

    default:
      deleteMessage(message);
      break;
  }

  screenshotsAuthors[message.author.id].nbWarning += 1;
};
