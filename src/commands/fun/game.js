const fs = require("fs").promises;
const path = require("path");

const Game = require("./classes/Game");
const Command = require("../../core/Command");
const Emojis = require("../../enums/Emojis");

module.exports = new Command({
    name: "game",
    description: "Play a game.",
    arguments: [
        {
            name: "id",
            description:
                "The id of the game you want to join.\nOr use one of the subcommands below to create a new game.",
            optional: true,
        },
    ],
    examples: [
        "{{command}} chakra-elements {{author}}",
        "{{command}} e-card\n> `Cbjef13Ahcehhjg2C4-xo0A7eKCn`",
        "{{command}} Cbjef13Ahcehhjg2C4-xo0A7eKCn",
        "{{command}} quit",
    ],
    async init() {
        (await fs.readdir(path.join(__dirname, "games"))).forEach((file) => {
            const game = require(`./games/${file}`);
            this.subcommand(game);
        });
    },
    async execute({ message, command, prefix }) {
        if (!command.content) {
            return message.channel.send(
                `Specifiy a game name or id.\nUse **${prefix}help game** for a list of available games.`
            );
        }
        const user = Game.parseId(command.content);
        if (!user) {
            throw new Error(`There is no game with that name or id.`);
        }
        user.game.add(message.author);
    },
}).subcommand({
    name: "quit",
    description: "Quit current game.",
    execute({ message }) {
        const game = message.author.game;
        if (!game) {
            throw new Error("You are not ingame.");
        }
        game.quit(message.author);
        message.react(Emojis.checkmark);
    },
});
