module.exports = async (client, interaction) => {
	if (!interaction.isButton()) return;

	const customId = interaction.customId;

	const roles = [
		{
			name: 'SF',
			value: '1166777414005825586',
		},
		{
			name: 'MRT',
			value: '1166777534197792872',
		},
		{
			name: 'FR',
			value: '1166777591961747456',
		},
		{
			name: 'Salage',
			value: '1166777719049158808',
		},
		{
			name: 'Mining',
			value: '1166777830332440607',
		},
		{
			name: 'Shipping',
			// value: '1166777924083523715',
			value: '794351586130264100', // Guest role on test server
		},
	];

	// if custom id exists in the roles array, add the role to the user
	if (roles.some((role) => role.name === customId)) {
		const roleId = roles.find((role) => role.name === customId).value;
		const role = await interaction.guild.roles.fetch(roleId);

		if (role) {
			if (interaction.member.roles.cache.has(roleId)) {
				await interaction.member.roles.remove(roleId);
				await interaction.reply({
					content: `You have been removed from the ${role.name} role.`,
					ephemeral: true,
				});
			} else {
				await interaction.member.roles.add(roleId);
				await interaction.reply({
					content: `You have been added to the ${role.name} role.`,
					ephemeral: true,
				});
			}
		}
	}
};
