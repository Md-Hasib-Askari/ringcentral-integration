const RC = require('@ringcentral/sdk').SDK;
require('dotenv').config();

console.log({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_APP_CLIENT_ID,
    clientSecret: process.env.RC_APP_CLIENT_SECRET,
    jwt: process.env.RC_USER_JWT
});
const rcsdk = new RC({
    server: process.env.RC_SERVER_URL,
    clientId: process.env.RC_APP_CLIENT_ID,
    clientSecret: process.env.RC_APP_CLIENT_SECRET
});

const platform = rcsdk.platform();
platform.login({
    jwt: process.env.RC_USER_JWT
})
.then(function(response) {
    console.log('Logged in');
    response.json().then(function(data) {
        console.log(data);
    });
})
.catch(function(e) {
    console.error(e.message);
});

platform.on(platform.events.loginSuccess, async function() {
    console.log('Logged in');
    // Request List extension numbers
    platform.get('/restapi/v1.0/account/~/extension')

    // Request Device SIP Info
    platform.post('https://platform.devtest.ringcentral.com/restapi/v1.0/client-info/sip-provision', {
        sipInfo: [{ transport: 'WSS' }]
    })
    .then(async function(response) {
        console.log('Got SIP Info');
        response.json().then(function(data) {
            console.log(data.sipInfo[0]);
        });
    }).catch(function(e) {
        console.error(e.message);
    });
    // platform.post('/restapi/oauth/wstoken')
    // .then(async function(response) {
    //     console.log('Got WS token');
    //     response.json().then(function(data) {
    //         console.log(data);
    //         platform.get('wss://servername.ringcentral.com/ws')
    //             .then(async function(response) {
    //                 console.log('Connected to WS');
    //                 response.json().then(function(data) {
    //                     console.log(data);
    //                 });
    //             })
    //             .catch(function(e) {
    //                 console.error(e.message);
    //             });
    //     });
    // });
});