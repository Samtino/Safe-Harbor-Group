const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require('discord.js');
const Rules = require('../../models/Rules.js');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'rules-add',
	description: 'Add a rule to the rules embed',
	options: [
		{
			name: 'rule',
			description: 'The rule to add',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: 'rule-number',
			description: 'Edit an existing rule',
			type: ApplicationCommandOptionType.Integer,
			minValue: 1,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		const rule = interaction.options.get('rule').value;
		const ruleNumber =
			interaction.options.get('rule-number')?.value || null;

		await interaction.deferReply({
			ephemeral: true,
		});

		try {
			let rules = await Rules.findOne({
				guildId: interaction.guild.id,
			});

			if (!rules) {
				rules = new Rules({
					guildId: interaction.guild.id,
					rules: [],
				});
			}

			if (rules) {
				if (ruleNumber) {
					rules.rules[ruleNumber - 1] = {
						number: ruleNumber,
						rule,
					};
				} else {
					let ruleNumber = rules.rules.length + 1;
					rules.rules.push({
						number: ruleNumber,
						rule,
					});
				}
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
				content: `Rule ${ruleNumber} has been added.`,
				ephemeral: true,
			});
		} catch (error) {
			await interaction.editReply({
				content: 'There was an error while adding the rule.',
				ephemeral: true,
			});
			console.error(error);
		}
	},
};
