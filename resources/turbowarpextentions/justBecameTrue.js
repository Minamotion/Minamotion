// TurboWarp Extension made by MultiLayer
class ScratchCheckJustTrue {
    getInfo() {
        return {
            id: 'ScratchCheckJustTrue',
            name: 'Check if just',
            blocks: [
            {
                opcode: 'checkIfJustBecameTrue',
                blockType: Scratch.BlockType.BOOLEAN,
                text: "Check if [CONDITION] became [STATE]",
                arguments: {
                    CONDITION: {
                        type: Scratch.ArgumentType.BOOLEAN,
                    },
                    STATE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: "boolean",
                    }
                }
            }
        ]
    }

    checkIfJustBecameTrue(args) {
        return args.STATE === "true" ? args.CONDITION : !args.CONDITION;
    }
}

Scratch.extensions.register(new ScratchCheckJustTrue());