"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelVolumeAndEnvelopeRegister = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
class ChannelVolumeAndEnvelopeRegister extends MemoryRegister_1.MemoryRegister {
    get sweepPace() {
        return this.value & 0b111;
    }
    get envelopeDirection() {
        return this.getBit(3);
    }
    get initialVolume() {
        return this.value >> 4;
    }
}
exports.ChannelVolumeAndEnvelopeRegister = ChannelVolumeAndEnvelopeRegister;
