import userModel from "../models/userModel.js"
import { comparePassword, hashPassword } from '../helpers/helper.js'
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!email) {
            return res.send({ message: "Email is required" })
        }
        if (!password) {
            return res.send({ message: "Password is required" })
        }
        if (!phone) {
            return res.send({ message: "Phone numver is required" })
        }
        if (!address) {
            return res.send({ message: "Address is required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is required" })
        }


        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Registered please login"
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save()

        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        })
    }
};

export const resetPasswordController = async (req, res) => {

    try {

        const { email, answer, newPassword } = req.body;
        
        if (!email) {
            return res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is required" })
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New Password is required" })
        }

        const user = await userModel.findOne({ email });
        const u_ans = user.answer

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid email"
            });
        }

        if(JSON.stringify(u_ans) != JSON.stringify(answer)){
            return res.send({
                success: false,
                message: "Invalid  answer"
            });
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(201).send({
            success: true,
            message: "User registered successfully",
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in registration",
            error
        })
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            })
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d', });

        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        });
    }
};


export const testController = (req, res) => {
    res.send('protected route');
}
