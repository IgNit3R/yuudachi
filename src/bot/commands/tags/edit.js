const { Argument, Command } = require('discord-akairo');
const { cleanContent } = require('../../../util/cleanContent');

class TagEditCommand extends Command {
	constructor() {
		super('tag-edit', {
			category: 'tags',
			description: {
				content: 'Edit a tag (Markdown can be used).',
				usage: '<tag> <content>',
				examples: ['Test Some new content', '"Test 1" Some more new content']
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'tag',
					type: 'tag',
					prompt: {
						start: message => `${message.author}, what tag do you want to edit?`,
						retry: (message, _, provided) => `${message.author}, a tag with the name **${provided.phrase}** does not exist.`
					}
				},
				{
					id: 'content',
					match: 'rest',
					type: Argument.validate('string', str => str.length <= 1950),
					prompt: {
						start: message => `${message.author}, what should the new content be?`,
						retry: message => `${message.author}, make sure the content isn't longer than 1950 characters!`
					}
				}
			]
		});
	}

	async exec(message, { tag, content }) {
		const staffRole = message.member.roles.has(this.client.settings.get(message.guild, 'modRole'));
		content = cleanContent(message, content);
		if (tag.user !== message.author.id && !staffRole) return message.util.reply('you can only edit your own tags.');
		await this.client.db.models.tags.update({ content }, { where: { name: tag.name, guild: message.guild.id } });

		return message.util.reply(`successfully edited **${tag}**.`);
	}
}

module.exports = TagEditCommand;