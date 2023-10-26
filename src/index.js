require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
	intents: [Object.keys(GatewayIntentBits)],
});

(async () => {
	try {
		mongoose
			.connect(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				dbName: 'SafeHarborGroup',
			})
			.then(() => console.log('Connected to MongoDB'));

		eventHandler(client);

		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`Error: ${error}`);
	}
})();

// TODO: WIP
// client.on(Events.GuildAuditLogEntryCreate, async => {
// 	const fs = require('fs');

// 	fs.writeFileSync('./data.json', JSON.stringify(entry, null, 4), 'utf-8');

// 	logAction(client);
// });
