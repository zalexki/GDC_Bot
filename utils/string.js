const bitly = process.env.BITLY_ACCESS_TOKEN
  ? require("bitly-node-api")(process.env.BITLY_ACCESS_TOKEN)
  : null;

exports.shortUrl = async (url) => {
  if (!bitly) return url;

  const data = {
    long_url: url,
  };
  try {
    var response = await bitly.bitlinks.shortenLink(data);
  } catch (error) {
    return url;
  }

  return response.link;
};
