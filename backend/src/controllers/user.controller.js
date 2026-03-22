import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { User } from '../models/user.model.js';

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        if (!name || !username || !password) {
            console.log("Data Missing");
            return res
                .status(httpStatus.NOT_FOUND)
                .json({
                    "message": "Data is Missing!",
                    "success": false
                });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(httpStatus.CONFLICT)
                .json({
                    "message": "User already exists",
                    "success": false
                });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                name: name,
                username: username,
                password: hashedPassword
            }
        );

        await newUser.save();

        res
            .status(httpStatus.CREATED)
            .json({
                "message": "User registered successfully",
                "success": true
            })

    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                "message": `Something went wrong! ${error}`
            })
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            console.log("Data Missing");
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({
                    "message": "Data is Missing!",
                    "success": false
                });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({
                    "message": "User don't exists",
                    "success": false
                });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid password",
                success: false
            });
        }


        let token = crypto.randomBytes(20).toString('hex');

        user.token = token;
        await user.save();

        return res.status(httpStatus.OK).json({
            message: "User logged in successfully",
            token,
            success: true
        });
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                "message": `Something went wrong! ${error}`
            })
    }
}

export { login, register }