"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel2 = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
const ChannelFrequencyHighRegister_1 = require("../registers/ChannelFrequencyHighRegister");
const ChannelLengthTimerAndDutyRegister_1 = require("../registers/ChannelLengthTimerAndDutyRegister");
const ChannelVolumeAndEnvelopeRegister_1 = require("../registers/ChannelVolumeAndEnvelopeRegister");
const MasterVolumeAndVinPanningRegister_1 = require("../registers/MasterVolumeAndVinPanningRegister");
const SoundOnRegister_1 = require("../registers/SoundOnRegister");
const SoundPanningRegister_1 = require("../registers/SoundPanningRegister");
class Channel2 {
    // per https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
    dutyTable = [
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 0] // 75%
    ];
    // protected dutyTable = [
    //   [0, 0, 0, 0, 0, 0, 0, 1], // 12.5 %
    //   [1, 0, 0, 0, 0, 0, 0, 1], // 25 %
    //   [1, 0, 0, 0, 0, 1, 1, 1], // 50 %
    //   [0, 1, 1, 1, 1, 1, 1, 0], // 75 %
    // ]
    memory;
    channelFrequencyLowRegister;
    channelFrequencyHighRegister;
    channelLengthTimerAndDutyRegister;
    channelVolumeAndEnvelopeRegister;
    soundPanningRegister;
    soundOnRegister;
    masterVolumeAndVinPanningRegister;
    volume = 0;
    periodTimer = 0;
    lengthTimer = 0;
    frequencyTimer = 0;
    waveDutyPosition = 0;
    constructor(memory) {
        this.memory = memory;
        this.channelLengthTimerAndDutyRegister = new ChannelLengthTimerAndDutyRegister_1.ChannelLengthTimerAndDutyRegister(0xff16, this.memory);
        this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_1.ChannelVolumeAndEnvelopeRegister(0xff17, this.memory);
        this.channelFrequencyLowRegister = new MemoryRegister_1.MemoryRegister(0xff18, this.memory);
        this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_1.ChannelFrequencyHighRegister(0xff19, this.memory);
        this.soundOnRegister = new SoundOnRegister_1.SoundOnRegister(this.memory);
        this.soundPanningRegister = new SoundPanningRegister_1.SoundPanningRegister(this.memory);
        this.masterVolumeAndVinPanningRegister = new MasterVolumeAndVinPanningRegister_1.MasterVolumeAndVinPanningRegister(this.memory);
    }
    tick(cycles) {
        this.frequencyTimer -= cycles;
        if (this.channelFrequencyHighRegister.restartTrigger) {
            this.restartSound();
            this.channelFrequencyHighRegister.restartTrigger = 0;
        }
        if (this.frequencyTimer <= 0) {
            this.frequencyTimer = this.getFrequencyTimer();
            this.waveDutyPosition = (this.waveDutyPosition + 1) % 8;
        }
    }
    restartSound() {
        this.soundOnRegister.isChannel2On = 1;
        this.periodTimer = this.channelVolumeAndEnvelopeRegister.sweepPace;
        this.volume = this.channelVolumeAndEnvelopeRegister.initialVolume;
        this.frequencyTimer = this.getFrequencyTimer();
        this.lengthTimer = 64 - this.channelLengthTimerAndDutyRegister.initialLengthTimer;
    }
    getSample() {
        const amplitude = this.dutyTable[this.channelLengthTimerAndDutyRegister.waveDuty][this.waveDutyPosition];
        const sampleWithVolume = this.volume !== 0 && this.soundOnRegister.isChannel2On ? amplitude * this.volume : 0.0;
        return (sampleWithVolume / 7.5) - 1;
    }
    clockLength() {
        if (this.channelFrequencyHighRegister.soundLengthEnable) {
            this.lengthTimer--;
            if (this.lengthTimer === 0) {
                this.soundOnRegister.isChannel2On = 0;
            }
        }
    }
    clockVolume() {
        const { sweepPace, envelopeDirection } = this.channelVolumeAndEnvelopeRegister;
        if (sweepPace !== 0) {
            if (this.periodTimer !== 0) {
                this.periodTimer--;
            }
            if (this.periodTimer === 0) {
                this.periodTimer = sweepPace;
                if (envelopeDirection === 0 && this.volume > 0) {
                    this.volume--;
                }
                else if (envelopeDirection === 1 && this.volume < 0xf) {
                    this.volume++;
                }
            }
        }
    }
    getFrequencyTimer() {
        return (2048 - this.getFrequency()) * 4;
    }
    getFrequency() {
        return this.channelFrequencyLowRegister.value | (this.channelFrequencyHighRegister.frequencyHighBits << 8);
    }
}
exports.Channel2 = Channel2;
