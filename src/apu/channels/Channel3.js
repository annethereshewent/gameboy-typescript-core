"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel3 = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
const ChannelDACEnableRegister_1 = require("../registers/ChannelDACEnableRegister");
const ChannelFrequencyHighRegister_1 = require("../registers/ChannelFrequencyHighRegister");
const ChannelOutputLevelRegister_1 = require("../registers/ChannelOutputLevelRegister");
const SoundOnRegister_1 = require("../registers/SoundOnRegister");
class Channel3 {
    memory;
    channelDACEnableRegister;
    channelFrequencyLowRegister;
    channelFrequencyHighRegister;
    channelLengthTimerRegister;
    channelOutputLevelRegister;
    soundOnRegister;
    sampleStartAddress = 0xff30;
    frequencyTimer = 0;
    samplePosition = 0;
    lengthTimer = 0;
    // see https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
    volumeShifts = [4, 0, 1, 2];
    constructor(memory) {
        this.memory = memory;
        this.channelDACEnableRegister = new ChannelDACEnableRegister_1.ChannelDACEnableRegister(this.memory);
        this.channelLengthTimerRegister = new MemoryRegister_1.MemoryRegister(0xff1b, this.memory);
        this.channelOutputLevelRegister = new ChannelOutputLevelRegister_1.ChannelOutputLevelRegister(this.memory);
        this.channelFrequencyLowRegister = new MemoryRegister_1.MemoryRegister(0xff1d, this.memory);
        this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_1.ChannelFrequencyHighRegister(0xff1e, this.memory);
        this.soundOnRegister = new SoundOnRegister_1.SoundOnRegister(this.memory);
    }
    tick(cycles) {
        this.frequencyTimer -= cycles;
        if (this.channelFrequencyHighRegister.restartTrigger) {
            this.restartSound();
            this.channelFrequencyHighRegister.restartTrigger = 0;
        }
        if (this.frequencyTimer <= 0) {
            this.frequencyTimer = this.getFrequencyTimer();
            this.samplePosition = (this.samplePosition + 1) % 32;
        }
    }
    clockLength() {
        if (this.channelFrequencyHighRegister.soundLengthEnable) {
            this.lengthTimer--;
            if (this.lengthTimer === 0) {
                this.soundOnRegister.isChannel3On = 0;
            }
        }
    }
    getSample() {
        const memoryIndex = Math.floor(this.samplePosition / 2);
        const isUpper = this.samplePosition % 2 === 0;
        const byte = this.memory.readByte(this.sampleStartAddress + memoryIndex);
        const sample = isUpper ? byte >> 4 : byte & 0b1111;
        const volumeAdjustedSample = sample >> this.volumeShifts[this.channelOutputLevelRegister.outputLevelSelection];
        if (this.soundOnRegister.isChannel3On && this.channelDACEnableRegister.dacEnabled) {
            return (volumeAdjustedSample / 7.5) - 1.0;
        }
        else {
            return 0;
        }
    }
    restartSound() {
        this.soundOnRegister.isChannel3On = 1;
        this.frequencyTimer = this.getFrequencyTimer();
        this.samplePosition = 0;
        this.lengthTimer = 256 - this.channelLengthTimerRegister.value;
    }
    getFrequencyTimer() {
        return (2048 - this.getFrequency()) * 2;
    }
    getFrequency() {
        return this.channelFrequencyLowRegister.value | (this.channelFrequencyHighRegister.frequencyHighBits << 8);
    }
}
exports.Channel3 = Channel3;
