"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    // possible characters forrandom string
    let options = "erdctfbghujmrdtfbghunjmrxctfvygbhun";
    let length = options.length;
    let ans = "";
    // link of 10 chars 
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)];
    }
    return ans;
}
