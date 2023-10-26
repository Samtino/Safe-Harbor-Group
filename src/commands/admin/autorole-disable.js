const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');
const AutoRole = require('../../models/autoRole');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'autorole-disable',
	description: 'Disable autorole for this server',
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		try {
			await interaction.deferReply({
				ephemeral: true,
			});

			if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
				await interaction.editReply(
					'You do not have an autorole configured for this server. Use `/autorole-configure` to configure one.',
				);
				return;
			}

			await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
			interaction.editReply(
				'Disabled autorole for this server. To re-enable it, use `/autorole-configure`.',
			);
		} catch (error) {
			console.log(error);
			await interaction.editReply(
				'There was an error with the autorole.',
			);
		}
	},
};
