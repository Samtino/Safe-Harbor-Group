const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require('discord.js');
const Rules = require('../../models/Rules');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'rules',
	description: 'Send the rules embed',
	options: [
		{
			name: 'target-channel',
			description: 'The channel to send the rules embed',
			type: ApplicationCommandOptionType.Channel,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		const targetChannel =
			interaction.options.get('target-channel')?.channel ||
			interaction.channel;

		await interaction.deferReply({
			ephemeral: true,
		});

		let rules = await Rules.findOne({
			guildId: interaction.guild.id,
		});

		if (!rules) {
			interaction.editReply(
				'There are no rules for this server. To add rules, use `/rules-add`.',
			);
			return;
		}

		try {
			let description = rules.rules
				.map((rule) => `${rule.number}. ${rule.rule}`)
				.join('\n');

			const rulesEmbed = new EmbedBuilder()
				.setTitle('Rules')
				.setDescription(description)
				.setTimestamp();

			const message = await targetChannel.send({ embeds: [rulesEmbed] });

			rules.messageId = message.id;

			await rules.save();

			await interaction.editReply({
				content: `Sent the rules embed to ${targetChannel}`,
				ephemeral: true,
			});
		} catch (error) {
			await interaction.editReply({
				content: 'There was an error sending the rules embed.',
				ephemeral: true,
			});
		}
	},
};
