module.exports = {
  clientId: '', // Go on the application main page and copy the Client ID
  clientSecret: '', // Go on the application main page and copy the Client Secret
  redirectUri: 'https://yourdomain.com/callback', 
  // Go to the application page -> OAuth2 and change the redirect to yourdomain.com/callback
  scopes: ['identify', 'guilds'] // You don't need any more than this
};
