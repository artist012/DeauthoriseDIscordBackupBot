const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async() => {
    const token = await new Promise(resolve => rl.question("[!] Token: ", resolve));
    
    var res = await axios.get(`https://discord.com/api/v9/oauth2/tokens`, {
        headers: {
            authorization: token
        }
    });
    
    if(res.status == 401) {
        return console.log("Invalid Token");
    } else if (res.status == 200) {
        const tokens = res.data.filter(_token => _token.scopes.includes("guilds.join"))

        console.log(`\nWe identified ${tokens.length} bots with potential for recovery.\n`)

        tokens.map(async (_token) => {
            console.log(`Deauthorize: ${_token.application.name}`)
            await axios.delete(`https://discord.com/api/v9/oauth2/tokens/${_token.id}`, {
                headers: {
                    authorization: token
                }
            });
        })
    } else {
        return console.log("wtf?");
    }
})()