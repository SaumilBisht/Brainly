"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
mongoose_1.default.connect("mongodb+srv://bishtsaumil:1gupbDqMS8dIYz63@cluster0.9p1qw.mongodb.net/Brainly");
const UserSchema = new mongoose_2.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
});
exports.UserModel = (0, mongoose_2.model)('User', UserSchema); //pehla collection(table name)
const ContentSchema = new mongoose_2.Schema({
    link: String,
    title: String,
    type: String,
    tags: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Tag'
        }
    ],
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
exports.ContentModel = (0, mongoose_2.model)('Content', ContentSchema);
const LinkSchema = new mongoose_2.Schema({
    hash: { type: String, required: true },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    }
});
exports.LinkModel = (0, mongoose_2.model)('Link', LinkSchema);
const TagsSchema = new mongoose_2.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
});
exports.TagModel = (0, mongoose_2.model)('Tag', TagsSchema);
//usermodel is just jisse CRUD queries bas
