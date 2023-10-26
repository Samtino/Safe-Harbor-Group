const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} = require('discord.js');

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	name: 'roles',
	description: 'Send the roles embed',
	options: [
		{
			name: 'target-channel',
			description: 'The channel to send the roles embed',
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

		const SecurityForces = new ButtonBuilder()
			.setCustomId('SF')
			.setLabel('Security Forces')
			.setStyle('Primary');
		const MedicalResponseTeam = new ButtonBuilder()
			.setCustomId('MRT')
			.setLabel('Medical Response Team')
			.setStyle('Primary');
		const FugutiveRecovery = new ButtonBuilder()
			.setCustomId('FR')
			.setLabel('Fugutive Recovery')
			.setStyle('Primary');
		const Salvage = new ButtonBuilder()
			.setCustomId('Salage')
			.setLabel('Salvage')
			.setStyle('Primary');
		const Mining = new ButtonBuilder()
			.setCustomId('Mining')
			.setLabel('Mining')
			.setStyle('Primary');
		const Shipping = new ButtonBuilder()
			.setCustomId('Shipping')
			.setLabel('Shipping')
			.setStyle('Primary');

		const row1 = new ActionRowBuilder().addComponents(
			SecurityForces,
			MedicalResponseTeam,
			FugutiveRecovery,
		);
		const row2 = new ActionRowBuilder().addComponents(
			Salvage,
			Mining,
			Shipping,
		);

		const embed = new EmbedBuilder()
			.setTitle('Roles')
			.setDescription('Click on the buttons below to get your roles.')
			.setTimestamp();

		const message = await targetChannel.send({
			embeds: [embed],
			components: [row1, row2],
		});

		await interaction.editReply({
			content: `Sent the roles embed to ${targetChannel}`,
			ephemeral: true,
		});
	},
};
