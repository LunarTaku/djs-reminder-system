const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const schedule = require("node-schedule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set a message reminder")
    .addStringOption((option) => {
      return option
        .setName("message")
        .setDescription("The messaged to be reminded")
        .setRequired(true)
        .setMaxLength(2000)
        .setMinLength(10);
    })
    .addIntegerOption((option) => {
      return option
        .setName("time")
        .setDescription("The time to send the message at. (IN MINUTES)")
        .setRequired(true)
        .setMinValue(1);
    }),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const message = interaction.options.getString("message");
    const time = interaction.options.getInteger("time");

    if (time >= 525960 * 1000) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Too much time was inputted, please input something over a year."
            )
            .setColor("Red"),
        ],
      });
    }

    const timeMs = time * 60000;

    const date = new Date(new Date().getTime() + timeMs);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Set reminder for \`${date.toTimeString()}\`!`)
          .addFields(
            {
              name: "<:9851squarejoin:1015234842964807711> Will be sent in",
              value: `<:reply:1015235235195146301> ${time} Minute(s)`,
              inline: true
            },
            {
              name: "<:Discussions:1015242700993351711> Message",
              value: `<:reply:1015235235195146301> \`${message}\``,
              inline: true
            }
          ),
      ],
      ephemeral: true,
    });

    // schedule and send the message.
    schedule.scheduleJob(date, async () => {
      await interaction.member.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Reminder for: ${date.toTimeString()}!`)
            .setDescription(
              `You wanted to remind yourself of: \`${message}\`!`
            ),
        ],
      });
    });
  },
};
