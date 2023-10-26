module.exports = {
	name: 'ping',
	description: 'Replies with the bot ping!',

	callback: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		interaction.editReply(`🏓 Pong! ${ping}ms`);
	},
};
