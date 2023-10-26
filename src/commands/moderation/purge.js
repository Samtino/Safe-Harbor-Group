const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'purge',
	description: 'Deletes a specified amount of messages.',
	options: [
		{
			name: 'amount',
			description: 'The amount of messages to delete.',
			type: ApplicationCommandOptionType.Integer,
			minValue: 1,
			maxValue: 100,
			required: true,
		},
		{
			name: 'user',
			description: '(Optional) Only delete message from a specific user.',
			type: ApplicationCommandOptionType.User,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ManageMessages],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	callback: async (client, interaction) => {
		const amount = interaction.options.get('amount').value;
		const userId = interaction.options.get('user')?.value;

		await interaction.deferReply({
			ephemeral: true,
		});

		if (userId) {
			const user = await interaction.guild.members.fetch(userId);
			const messages = await interaction.channel.messages.fetch({
				limit: amount,
			});

			const filtered = messages.filter((msg) => msg.author.id === userId);

			await interaction.channel.bulkDelete(filtered);

			await interaction.editReply(
				`${filtered.size} messages deleted from ${user.user}#${user.discriminator}.`,
			);

			return;
		}

		await interaction.channel.bulkDelete(amount);

		await interaction.editReply(`${amount} messages deleted.`);
	},
};
