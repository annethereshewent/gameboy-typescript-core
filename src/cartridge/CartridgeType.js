"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartridgeType = void 0;
/**
 * per https://gbdev.io/pandocs/The_Cartridge_Header.html
 */
var CartridgeType;
(function (CartridgeType) {
    CartridgeType[CartridgeType["ROM"] = 0] = "ROM";
    CartridgeType[CartridgeType["MBC1"] = 1] = "MBC1";
    CartridgeType[CartridgeType["MBC1_PLUS_RAM"] = 2] = "MBC1_PLUS_RAM";
    CartridgeType[CartridgeType["MBC1_PLUS_RAM_PLUS_BATTERY"] = 3] = "MBC1_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC2"] = 5] = "MBC2";
    CartridgeType[CartridgeType["MBC2_PLUS_BATTERY"] = 6] = "MBC2_PLUS_BATTERY";
    CartridgeType[CartridgeType["ROM_PLUS_RAM"] = 8] = "ROM_PLUS_RAM";
    CartridgeType[CartridgeType["ROM_PLUS_RAM_PLUS_BATTERY"] = 9] = "ROM_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MM01"] = 11] = "MM01";
    CartridgeType[CartridgeType["MM01_PLUS_RAM"] = 12] = "MM01_PLUS_RAM";
    CartridgeType[CartridgeType["MMO1_PLUS_RAM_PLUS_BATTERY"] = 13] = "MMO1_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC3_PLUS_TIMER_PLUS_BATTERY"] = 15] = "MBC3_PLUS_TIMER_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY"] = 16] = "MBC3_PLUS_TIMER_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC3"] = 17] = "MBC3";
    CartridgeType[CartridgeType["MBC3_PLUS_RAM"] = 18] = "MBC3_PLUS_RAM";
    CartridgeType[CartridgeType["MBC3_PLUS_RAM_PLUS_BATTERY"] = 19] = "MBC3_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC5"] = 25] = "MBC5";
    CartridgeType[CartridgeType["MBC5_PLUS_RAM"] = 26] = "MBC5_PLUS_RAM";
    CartridgeType[CartridgeType["MBC5_PLUS_RAM_PLUS_BATTERY"] = 27] = "MBC5_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE"] = 28] = "MBC5_PLUS_RUMBLE";
    CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE_PLUS_RAM"] = 29] = "MBC5_PLUS_RUMBLE_PLUS_RAM";
    CartridgeType[CartridgeType["MBC5_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY"] = 30] = "MBC5_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["MBC6"] = 32] = "MBC6";
    CartridgeType[CartridgeType["MBC7_PLUS_SENSOR_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY"] = 34] = "MBC7_PLUS_SENSOR_PLUS_RUMBLE_PLUS_RAM_PLUS_BATTERY";
    CartridgeType[CartridgeType["POCKET_CAMERA"] = 252] = "POCKET_CAMERA";
    CartridgeType[CartridgeType["BANDAI_TAMA5"] = 253] = "BANDAI_TAMA5";
    CartridgeType[CartridgeType["HuC3"] = 254] = "HuC3";
    CartridgeType[CartridgeType["HuC1_PLUS_RAM_PLUS_BATTERY"] = 255] = "HuC1_PLUS_RAM_PLUS_BATTERY";
})(CartridgeType = exports.CartridgeType || (exports.CartridgeType = {}));
