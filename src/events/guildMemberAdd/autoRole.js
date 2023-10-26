const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const AutoRole = require('../../models/autoRole');

module.exports = async (client, member) => {
	/**
	 *
	 * @param {Client} client
	 * @param {GuildMember} member
	 */

	try {
		let guild = member.guild;
		if (!guild) return;

		const welcomeChannel = guild.channels.cache.get(guild.systemChannelId);
		const rulesChannel =
			guild.channels.cache.get(guild.rulesChannelId) ||
			guild.channels.cache.find((channel) => channel.name === 'rules');

		if (!welcomeChannel) return;

		const welcomeEmbed = new EmbedBuilder()
			.setTitle('Welcome to the Safe Harbor Group Discord Server!')
			.setDescription(
				`You are the ${guild.memberCount}th member of this server!`,
			)
			.setColor('Red')
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
				{
					name: 'Rules',
					value: `Please read the rules in the ${rulesChannel} channel!`,
				},
				{
					name: 'Roles',
					value: 'You can get roles in the roles channel!',
				},
			);

		const autoRole = await AutoRole.findOne({ guildId: guild.id });
		if (!autoRole) {
			await welcomeChannel.send({
				content: `<@${member.id}>`,
				embeds: [welcomeEmbed],
			});
			return;
		}

		await member.roles.add(autoRole.roleId);

		await welcomeChannel.send({
			content: `<@${member.id}>`,
			embeds: [welcomeEmbed],
		});
	} catch (error) {
		console.log('Error giving role automatically: ');
		console.error(error);
	}
};
