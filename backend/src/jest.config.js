"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest', 
    testEnvironment: 'node', 
    verbose: true, 
    moduleFileExtensions: ['ts', 'js'], 
    transform: {
        '^.+\\.ts$': 'ts-jest', 
    },
    extensionsToTreatAsEsm: ['.ts'], 
};
exports.default = config;
