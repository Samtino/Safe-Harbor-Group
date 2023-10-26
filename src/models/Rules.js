const { Schema, model } = require('mongoose');

const autoRoleSchema = new Schema({
	guildId: {
		type: String,
		required: true,
		unique: true,
	},
	messageId: {
		type: String,
		required: false,
	},
	rules: [
		{
			number: {
				type: Number,
				required: true,
			},
			rule: {
				type: String,
				required: true,
			},
		},
	],
});

module.exports = model('Rules', autoRoleSchema);
