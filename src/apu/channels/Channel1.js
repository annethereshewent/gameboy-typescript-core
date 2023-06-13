"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel1 = void 0;
const MemoryRegister_1 = require("../../cpu/memory_registers/MemoryRegister");
const ChannelFrequencyHighRegister_1 = require("../registers/ChannelFrequencyHighRegister");
const ChannelLengthTimerAndDutyRegister_1 = require("../registers/ChannelLengthTimerAndDutyRegister");
const ChannelSweepRegister_1 = require("../registers/ChannelSweepRegister");
const ChannelVolumeAndEnvelopeRegister_1 = require("../registers/ChannelVolumeAndEnvelopeRegister");
const Channel2_1 = require("./Channel2");
/**
 * Channel1 is essentially the same as
 * Channel2, except with a sweep function
 * added
 */
class Channel1 extends Channel2_1.Channel2 {
    sweepEnabled = false;
    sweepTimer = 0;
    shadowFrequency = 0;
    channelSweepRegister;
    constructor(memory) {
        super(memory);
        this.channelSweepRegister = new ChannelSweepRegister_1.ChannelSweepRegister(memory);
        this.channelLengthTimerAndDutyRegister = new ChannelLengthTimerAndDutyRegister_1.ChannelLengthTimerAndDutyRegister(0xff11, this.memory);
        this.channelVolumeAndEnvelopeRegister = new ChannelVolumeAndEnvelopeRegister_1.ChannelVolumeAndEnvelopeRegister(0xff12, this.memory);
        this.channelFrequencyLowRegister = new MemoryRegister_1.MemoryRegister(0xff13, this.memory);
        this.channelFrequencyHighRegister = new ChannelFrequencyHighRegister_1.ChannelFrequencyHighRegister(0xff14, this.memory);
    }
    restartSound() {
        this.soundOnRegister.isChannel2On = 1;
        this.periodTimer = this.channelVolumeAndEnvelopeRegister.sweepPace;
        this.volume = this.channelVolumeAndEnvelopeRegister.initialVolume;
        this.frequencyTimer = this.getFrequencyTimer();
        this.lengthTimer = 64 - this.channelLengthTimerAndDutyRegister.initialLengthTimer;
        this.sweepTimer = this.channelSweepRegister.sweepPace !== 0 ? this.channelSweepRegister.sweepPace : 8;
        if (this.channelSweepRegister.sweepPace > 0 || this.channelSweepRegister.sweepShift > 0) {
            this.sweepEnabled = true;
        }
        this.shadowFrequency = this.getFrequency();
    }
    calculateFrequency() {
        let newFrequency = this.shadowFrequency >> this.channelSweepRegister.sweepShift;
        if (this.channelSweepRegister.sweepDirection === 1) {
            newFrequency = this.shadowFrequency + newFrequency;
        }
        else {
            newFrequency = this.shadowFrequency - newFrequency;
        }
        if (newFrequency > 2047) {
            this.soundOnRegister.isChannel1On = 0;
        }
        return newFrequency;
    }
    clockSweep() {
        if (this.sweepTimer > 0) {
            this.sweepTimer--;
        }
        if (this.sweepTimer === 0) {
            this.sweepTimer = this.channelSweepRegister.sweepPace !== 0 ? this.channelSweepRegister.sweepPace : 8;
            if (this.sweepEnabled && this.sweepTimer > 0) {
                const newFrequency = this.calculateFrequency();
                if (newFrequency < 2047 && this.sweepTimer > 0) {
                    this.frequencyTimer = newFrequency;
                    this.shadowFrequency = newFrequency;
                }
            }
        }
    }
}
exports.Channel1 = Channel1;
