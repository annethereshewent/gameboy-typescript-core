"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APU = void 0;
const AudioBufferPlayer_1 = require("./AudioBufferPlayer");
const Channel1_1 = require("./channels/Channel1");
const Channel2_1 = require("./channels/Channel2");
const Channel3_1 = require("./channels/Channel3");
const Channel4_1 = require("./channels/Channel4");
class APU {
    memory;
    channel1;
    channel2;
    channel3;
    channel4;
    // https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
    frameSequencerCyclesPerStep = 8192;
    frameSequencerStep = 0;
    audioContext = new AudioContext({ sampleRate: 44100 });
    cpuUperatingHertz = 4194304;
    cyclesPerSample = this.cpuUperatingHertz / 44100;
    sampleCycles = 0;
    frameSequencerCycles = 0;
    audioBufferPlayer;
    constructor(memory) {
        this.memory = memory;
        this.channel1 = new Channel1_1.Channel1(memory);
        this.channel2 = new Channel2_1.Channel2(memory);
        this.channel3 = new Channel3_1.Channel3(memory);
        this.channel4 = new Channel4_1.Channel4(memory);
        this.audioBufferPlayer = new AudioBufferPlayer_1.AudioBufferPlayer(this.audioContext);
    }
    tick(cycles) {
        this.sampleCycles += cycles;
        this.frameSequencerCycles += cycles;
        this.channel1.tick(cycles);
        this.channel2.tick(cycles);
        this.channel3.tick(cycles);
        this.channel4.tick(cycles);
        if (this.frameSequencerCycles >= this.frameSequencerCyclesPerStep) {
            this.advanceFrameSequencer();
            this.frameSequencerCycles -= this.frameSequencerCyclesPerStep;
        }
        if (this.sampleCycles >= this.cyclesPerSample) {
            this.sampleAudio();
            this.sampleCycles -= this.cyclesPerSample;
        }
    }
    // https://nightshade256.github.io/2021/03/27/gb-sound-emulation.html
    // Step   Length Ctr  Vol Env     Sweep
    // ---------------------------------------
    // 0      Clock       -           -
    // 1      -           -           -
    // 2      Clock       -           Clock
    // 3      -           -           -
    // 4      Clock       -           -
    // 5      -           -           -
    // 6      Clock       -           Clock
    // 7      -           Clock       -
    // ---------------------------------------
    // Rate   256 Hz      64 Hz       128 Hz
    advanceFrameSequencer() {
        switch (this.frameSequencerStep) {
            case 0:
                this.clockLength();
                break;
            case 2:
                this.clockLength();
                this.clockSweep();
                break;
            case 4:
                this.clockLength();
                break;
            case 6:
                this.clockLength();
                this.clockSweep();
                break;
            case 7:
                this.clockVolume();
                break;
        }
        this.frameSequencerStep = (this.frameSequencerStep + 1) % 8;
    }
    sampleAudio() {
        const sample = (this.channel1.getSample() + this.channel2.getSample() + this.channel3.getSample() + this.channel4.getSample()) / 4;
        this.audioBufferPlayer.writeSample(sample);
    }
    clockLength() {
        this.channel1.clockLength();
        this.channel2.clockLength();
        this.channel3.clockLength();
        this.channel4.clockLength();
    }
    clockSweep() {
        this.channel1.clockSweep();
    }
    clockVolume() {
        this.channel1.clockVolume();
        this.channel2.clockVolume();
        this.channel4.clockVolume();
    }
}
exports.APU = APU;
