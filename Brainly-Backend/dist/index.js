"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const config_1 = require("./config");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//signup:username,pass
const userzod = zod_1.default.object({
    username: zod_1.default.string().min(3),
    password: zod_1.default.string()
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body; //destructing se body se liya
    const { password } = req.body;
    try {
        const { success } = userzod.safeParse({ username, password });
        //hash kro
        if (!success) {
            res.status(411).json({
                message: "Inputs Invalid"
            });
        }
        //were not checking if user exists here as humne unique username key di h in db
        yield db_1.UserModel.create({
            username, password
        });
        res.json({
            message: "User signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User Exists"
        });
    }
}));
//signin: token return 
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body; //destructing se body se liya
    const { password } = req.body;
    try {
        const { success } = userzod.safeParse({ username, password });
        //hash kro
        if (!success) {
            res.status(411).json({
                message: "Inputs Invalid"
            });
        }
        //were not checking if user exists here as humne unique username key di h in db
        const user = yield db_1.UserModel.findOne({
            username, password
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_PASSWORD);
            res.json({
                token
            });
        }
        else {
            res.status(403).json({
                message: "User does not exist"
            });
        }
    }
    catch (e) {
        res.status(411).json({
            message: "Signin Failed"
        });
    }
}));
//add content
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link } = req.body;
    const { title } = req.body;
    const { type } = req.body;
    yield db_1.ContentModel.create({
        link,
        title,
        type,
        //@ts-ignore
        userId: req.userId, // userId is added by the middleware.
        tags: [] // Initialize tags as an empty array.
    });
    res.json({
        message: "Content Added"
    });
}));
//fetching existing docs of user
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username"); //foriegn key or ref was userId
    res.json({ content });
}));
//deleting apna contents
app.delete("app/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    //@ts-ignore
    yield db_1.ContentModel.deleteOne({ _id: contentId, userId: req.userId });
    res.json({
        message: "Contents deleted successfully"
    });
}));
//Share Content Link
//middleware use as userId chahiye
//This endpoint allows users to generate or remove a shareable link for their content.
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body; //boolean h share user ne diya h boy mei
    if (share) {
        //@ts-ignore
        // Check if a link already exists for the user.
        const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); // Send existing hash if found.
            return;
        }
        // Generate a new hash for the shareable link.
        const hash = (0, utils_1.random)(10);
        //@ts-ignore
        yield db_1.LinkModel.create({ userId: req.userId, hash });
        res.json({ hash }); // Send new hash in the response.
    }
    else {
        // Remove the shareable link if share is false.
        //@ts-ignore
        yield db_1.LinkModel.deleteOne({ userId: req.userId });
        res.json({ message: "Removed link" });
    }
}));
//Get Shared Content from the link
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    // Find the link using the provided hash.
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }
    // Fetch content and user details for the shareable link.
    const content = yield db_1.ContentModel.find({ userId: link.userId }); //for content
    const user = yield db_1.UserModel.findOne({ _id: link.userId }); //for username
    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }
    res.json({
        username: user === null || user === void 0 ? void 0 : user.username, //? for typescript cuz usse nhi pta
        content
    });
}));
app.listen(3000);
