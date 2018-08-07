const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class TagInfoCommand extends Command {
	constructor() {
		super('tag-info', {
			category: 'tags',
			description: {
				content: 'Displays information about a tag.',
				usage: '<tag>'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'tag',
					match: 'content',
					type: 'tag',
					prompt: {
						start: message => `${message.author}, what tag do you want information on?`,
						retry: (message, _, provided) => `${message.author}, a tag with the name **${provided.phrase}** does not exist.`
					}
				}
			]
		});
	}

	async exec(message, { tag }) {
		const user = await this.client.users.fetch(tag.user);
		const guild = this.client.guilds.get(tag.guild);
		const embed = new MessageEmbed()
			.setColor(3447003)
			.addField('User', user ? `${user.tag} (ID: ${user.id})` : "Couldn't fetch user.")
			.addField('Guild', guild ? `${guild.name}` : "Couldn't fetch guild.")
			.addField('Uses', tag.uses)
			.addField('Created at', moment.utc(tag.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ'))
			.addField('Modified at', moment.utc(tag.updatedAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ'));

		return message.util.send(embed);
	}
}

module.exports = TagInfoCommand;