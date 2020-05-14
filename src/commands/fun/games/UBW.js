const Command = require("../../../core/Command");
const PVPGame = require("../classes/PVPGame");

class UBW extends PVPGame {
    constructor(host, prefix) {
        super(host, {
            broadcastDM: false,
        });
        this.prefix = prefix;
        this.blades = 20;
    }
    async start() {
        const rand = this.users[Math.floor(Math.random() * 2)];
        this.turn = rand;
        this.broadcast.send(
            `**Game Start**\nThere are **${this.blades}** 🗡️.\nType **${this.prefix}throw 1|2|3** to throw one or two or three blades.\n**${rand.name}**'s turn.`,
            false
        );
    }
    throw(n) {
        n = Number(n);
        if (isNaN(n) || (n != 1 && n != 2 && n != 3)) {
            this.broadcast.send(`You must throw 1 or 2 or 3 blades.`, false);
            return;
        }
        this.blades -= n;
        if (this.blades <= 0) {
            this.broadcast.send(
                `**UBW Game Over**\n**${this.turn.name}** won the game.`,
                false
            );
            this.destroy();
            return;
        }
        const newTurn = this.users.find((gameUser) => gameUser != this.turn);
        this.broadcast.send(
            `**${this.turn.name}** threw **${n}** blades. **(${this.blades} 🗡️ left)**\n**${newTurn.name}**'s turn.`,
            false
        );
        this.turn = newTurn;
    }
}

module.exports = new Command({
    name: "ubw",
    channelType: "text",
    gameClass: UBW,
    description: "Play Unlimited Blade Works.",
    execute({ message, prefix }) {
        UBW.from(message, prefix);
    },
});
