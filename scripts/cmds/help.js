const axios = require("axios");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.00",
    author: "Sazid Moontasir",
    countDown: 5,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{p}help cmdName ",
    },
    priority: 1,
  },
  onStart: async function ({ message, args, event, threadsData }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      for (const [name, value] of commands) {
        const category = value.config.category || "Uncategorized";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(name);
      }

      Object.keys(categories).forEach((category) => {
        const categoryName = category.toUpperCase().replace(/-/g, " ");
        msg += \n╭──『 ${categoryName} 』;
        const commandsList = categories[category].map((cmd) => ✧${cmd}).join(" ");
        msg += \n${commandsList}\n╰───────────◊\n;
      });

      // Footer
      const totalCommands = Object.values(categories).flat().length;
      msg += ╭────────────◊\n;
      msg += │ » Type [ ${prefix}addowner] to add\n;
      msg += │ » admin to your group chat.\n;
      msg += │ » use [ ${prefix}support ] to join\n;
      msg += │ » support group.\n;
      msg += │ » Total cmds: [ ${totalCommands} ].\n;
      msg += │ » Type [ ${prefix}help <cmd> ]\n;
      msg += │ to learn the usage.\n;
      msg += ╰────────◊\n\n;
      msg +=     「 🐐V2 | Lvy Muse 」;

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(Command "${commandName}" not found.);
      } else {
        const configCommand = command.config;
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
╭──◊
  │ 🔶 ${configCommand.name.toUpperCase()}
  ├── INFO
  │ 📝 Description: ${longDescription}
  │ 👑 Author: ${author}
  │ ⚙ Guide: ${usage}
  ╰───────────◊
`;

        await message.reply(response);
      }
    }
  },
};
