// TurboWarp Extension made by MultiLayer
class justBecameTrue {
        getInfo() {
            return {
                id: 'justBecameTrue',
                name: 'Check if condition became true/false',
                blocks: [
                {
                    opcode: 'justBecameTrue',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "Check if [CONDITION] became [STATE]",
                    isEdgeActivated: true,
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
        };
    }
    justBecameTrue(args) {
        return args.STATE === "true" ? args.CONDITION : !args.CONDITION;
    }
}

Scratch.extensions.register(new justBecameTrue());