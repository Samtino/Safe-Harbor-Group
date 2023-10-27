const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');
const AutoRole = require('../../models/autoRole.js');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'autorole-configure',
	description: 'Configure your autorole for this server',
	options: [
		{
			name: 'target-role',
			description: 'The role to be given to new members',
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.ManageMessages],

	callback: async (client, interaction) => {
		const targetRoleId = interaction.options.get('target-role').value;

		try {
			await interaction.deferReply({
				ephemeral: true,
			});

			let autoRole = await AutoRole.findOne({
				guildId: interaction.guild.id,
			});

			if (autoRole) {
				if (autoRole.roleId === targetRoleId) {
					await interaction.editReply(
						'That role is already your autorole. To disable autorole, use `/autorole-disable`.',
					);
					return;
				}

				autoRole.roleId = targetRoleId;
			} else {
				autoRole = new AutoRole({
					guildId: interaction.guild.id,
					roleId: targetRoleId,
				});
			}

			await autoRole.save();

			await interaction.editReply(
				`Your autorole has been set to <@&${targetRoleId}>. To disable autorole, use \`/autorole-disable\`.`,
			);
		} catch (error) {
			console.log(error);
			await interaction.editReply(
				'There was an error with the autorole.',
			);
		}
	},
};
