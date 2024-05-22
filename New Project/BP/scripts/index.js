import { world, system } from "@minecraft/server";
import { handleTeleportCommands } from 'teleport';

// Initialize event listeners
function initialize() {
	handleTeleportCommands();
}

initialize();
