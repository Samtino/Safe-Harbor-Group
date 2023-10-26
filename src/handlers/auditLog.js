const { Events, EmbedBuilder } = require('discord.js');

module.exports = (client) => {
	const logEmbed = new EmbedBuilder().setColor('Blue');

	client.on(Events.MessageDelete, async (message) => {
		console.log(message);
	});
};
