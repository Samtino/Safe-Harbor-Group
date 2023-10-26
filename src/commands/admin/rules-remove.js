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

	name: 'rules-remove',
	description: 'Remove a rule to the rules embed',
	options: [
		{
			name: 'rule-number',
			description: 'The rule number to remove',
			type: ApplicationCommandOptionType.Integer,
			minValue: 1,
			required: true,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		try {
			let rules = await Rules.findOne({
				guildId: interaction.guild.id,
			});

			if (!rules) {
				interaction.editReply(
					'There are no rules for this server. To add rules, use `/rules-add`.',
				);
				return;
			}

			const ruleNumber =
				interaction.options.get('rule-number').value ||
				rules.rules.length;

			// remove the rule from the array
			if (rules) {
				rules.rules.splice(ruleNumber - 1, 1);
			}

			await rules.save();

			// if the rules message exists, edit it
			if (rules.messageId) {
				const rulesEmbed = new EmbedBuilder()
					.setTitle('Rules')
					.setDescription(
						rules.rules
							.map((rule) => `${rule.number}. ${rule.rule}`)
							.join('\n'),
					)
					.setTimestamp();

				const rulesMessage = await interaction.channel.messages.fetch(
					rules.messageId,
				);

				await rulesMessage.edit({ embeds: [rulesEmbed] });
			}

			await interaction.editReply({
				content: `Rule #${ruleNumber} has been removed.`,
				ephemeral: true,
			});
		} catch (error) {
			await interaction.editReply({
				content: `There was an error while removing the rule.`,
				ephemeral: true,
			});
			console.error(error);
		}
	},
};
