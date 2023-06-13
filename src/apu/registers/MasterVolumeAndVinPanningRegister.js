"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterVolumeAndVinPanningRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class MasterVolumeAndVinPanningRegister extends MemoryRegister_1.MemoryRegister {
    constructor(memory) {
        super(0xff24, memory);
    }
    get rightVolume() {
        return (this.value & 0b111) + 1;
    }
    get mixVinIntoRightOutput() {
        return this.getBit(3);
    }
    get leftVolume() {
        return ((this.value >> 4) & 0b111) + 1;
    }
    get mixVinIntoLeftOutput() {
        return this.getBit(7);
    }
}
exports.MasterVolumeAndVinPanningRegister = MasterVolumeAndVinPanningRegister;
