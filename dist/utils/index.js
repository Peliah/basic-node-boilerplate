"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserName = void 0;
const generateUserName = () => {
    const usernamePrefix = 'user-';
    const randomSuffix = Math.random().toString(36).slice(2);
    const username = `${usernamePrefix}${randomSuffix}`;
    return username;
};
exports.generateUserName = generateUserName;
