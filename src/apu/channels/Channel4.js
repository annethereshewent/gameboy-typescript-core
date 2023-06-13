"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel4 = void 0;
const BitOperations_1 = require("../../misc/BitOperations");
const Channel4ControlRegister_1 = require("../registers/Channel4ControlRegister");
const Channel4LengthTimerRegister_1 = require("../registers/Channel4LengthTimerRegister");
const ChannelFrequencyAndRandomnessRegister_1 = require("../registers/ChannelFrequencyAndRandomnessRegister");
const ChannelVolumeAndEnvelopeRegister_1 = require("../registers/ChannelVolumeAndEnvelopeRegister");
const SoundOnRegister_1 = require("../registers/SoundOnRegister");
class Channel4 {
    channel4LengthTimerRegister;
    channelVolumeAndEnvelopeRegister;
    channelFrequencyAndRandomnessRegister;
    soundOnRegister;
    channel4ControlRegister;
    memory;
    divisors = [8, 16, 32, 48, 64, 80, 96, 112];
    frequencyTimer = 0;
    lengthTimer = 0;
    volume = 0;
    linearFeedbackShift = 0;
    periodTimer = 0;
    constructor(memory) {
        this.memory = memory;
        this.channel4LengthTimerRegister = new Channel4LengthTimerRegister_1.Channel4LengthTimerRegister(this.memory);
        this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_1.ChannelVolumeAndEnvelopeRegister(0xff21, this.memory);
        this.channelFrequencyAndRandomnessRegister = new ChannelFrequencyAndRandomnessRegister_1.ChannelFrequencyAndRandomnessRegister(this.memory);
        this.channel4ControlRegister = new Channel4ControlRegister_1.Channel4ControlRegister(this.memory);
        this.soundOnRegister = new SoundOnRegister_1.SoundOnRegister(this.memory);
    }
    tick(cycles) {
        if (this.channel4ControlRegister.restartTrigger) {
            this.restartSound();
        }
        this.frequencyTimer -= cycles;
        if (this.frequencyTimer === 0) {
            this.frequencyTimer = this.getFrequencyTimer();
            const xorResult = (0, BitOperations_1.getBit)(this.linearFeedbackShift, 0) ^ (0, BitOperations_1.getBit)(this.linearFeedbackShift, 1);
            this.linearFeedbackShift = (this.linearFeedbackShift >> 1) | (xorResult << 14);
            if (this.channelFrequencyAndRandomnessRegister.lfsrWidth === 1) {
                this.linearFeedbackShift = (0, BitOperations_1.setBit)(this.linearFeedbackShift, 6, xorResult);
            }
        }
    }
    clockLength() {
        if (this.channel4ControlRegister.soundLengthEnable) {
            this.lengthTimer--;
            if (this.lengthTimer === 0) {
                this.soundOnRegister.isChannel4On = 0;
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
    getSample() {
        const sampleWithVolume = (~this.linearFeedbackShift & 0b1) * this.volume;
        if (this.soundOnRegister.isChannel4On) {
            return (sampleWithVolume / 7.5) - 1;
        }
        else {
            return 0;
        }
    }
    restartSound() {
        this.soundOnRegister.isChannel4On = 1;
        this.frequencyTimer = this.getFrequencyTimer();
        this.linearFeedbackShift = 0b111111111111111;
    }
    getFrequencyTimer() {
        const divisor = this.divisors[this.channelFrequencyAndRandomnessRegister.divisorCode];
        return divisor << this.channelFrequencyAndRandomnessRegister.clockShift;
    }
}
exports.Channel4 = Channel4;
