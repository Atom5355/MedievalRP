import { world, system } from "@minecraft/server";

const SPAWN_LOCATION = { x: 0, y: 64, z: 0 };
const TELEPORT_DELAY = 5; // Countdown time in seconds
const MOVEMENT_THRESHOLD = 1.0; // Movement threshold in blocks

// Map to track teleport countdowns
const teleportMap = new Map();

// Function to teleport player to spawn
function teleportToSpawn(player) {
    player.runCommandAsync(`tp @s ${SPAWN_LOCATION.x} ${SPAWN_LOCATION.y} ${SPAWN_LOCATION.z}`);
    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§6You have been teleported to the spawn!"}]}`);
    system.runTimeout(() => {
        player.runCommandAsync(`playsound entity.enderman.teleport @s`);
    }, 1); // Delay of 1 tick (50ms)
}

// Function to handle teleport countdown
function handleTeleportCountdown(player) {
    let countdown = TELEPORT_DELAY;
    const initialPosition = { x: player.location.x, y: player.location.y, z: player.location.z };
    teleportMap.set(player.nameTag, initialPosition);
    player.runCommandAsync(`playsound random.orb @s`);

    const intervalId = system.runInterval(() => {
        if (!teleportMap.has(player.nameTag)) {
            system.clearRun(intervalId);
            return;
        }

        const currentPosition = teleportMap.get(player.nameTag);
        const distance = Math.sqrt(
            Math.pow(player.location.x - currentPosition.x, 2) +
            Math.pow(player.location.y - currentPosition.y, 2) +
            Math.pow(player.location.z - currentPosition.z, 2)
        );

        if (distance > MOVEMENT_THRESHOLD) {
            teleportMap.delete(player.nameTag);
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cTeleportation canceled due to movement!"}]}`);
            player.runCommandAsync(`playsound random.orb @s`);
            system.clearRun(intervalId);
            return;
        }

        countdown--;
        if (countdown > 0) {
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§6Teleporting in ${countdown} seconds..."}]}`);
            player.runCommandAsync(`playsound random.orb @s`);
        } else {
            teleportToSpawn(player);
            teleportMap.delete(player.nameTag);
            system.clearRun(intervalId);
        }
    }, 20); // Run every second (20 ticks)
}

// Function to handle teleport commands
export function handleTeleportCommands() {
    world.beforeEvents.chatSend.subscribe((eventData) => {
        const player = eventData.sender;
        if (eventData.message.trim().toLowerCase() === "!spawn") {
            eventData.cancel = true;
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§6Teleporting to spawn in ${TELEPORT_DELAY} seconds. Do not move or take damage!"}]}`);
            handleTeleportCountdown(player);
        }
    });
}
