const { OAuth2Client } = require("google-auth-library");

async function verifyToken(jwtToken) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: jwtToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {}
}

module.exports = verifyToken;
