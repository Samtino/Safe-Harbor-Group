const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
} = require('discord.js');
const { stripIndent } = require('common-tags');

const links = stripIndent`[Organization Link](https://robertsspaceindustries.com/orgs/SAFEHARBOR)
            [FleetYard Invite](https://fltyrd.net/fi/JncdivM2uQ/)`;

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'info',
	description: 'Send the info embed',
	options: [
		{
			name: 'target-channel',
			description: 'The channel to send the info embed',
			type: ApplicationCommandOptionType.Channel,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		const targetChannelId =
			interaction.options.get('target-channel')?.value ||
			interaction.channel.id;

		const targetChannel = await interaction.guild.channels.fetch(
			targetChannelId,
		);

		if (!targetChannel) {
			await interaction.editReply(
				"That channel doesn't exist in this server.",
			);
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`Welcome to the Safe Harbor Group!`)
			.setDescription(`Placeholder`)
			.setColor('Red')
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.addFields({ name: 'Organization Link', value: links });

		await targetChannel.send({
			embeds: [embed],
		});

		await interaction.editReply({
			content: `Sent the info embed to ${targetChannel}`,
		});
	},
};
