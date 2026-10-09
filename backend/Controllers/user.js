const userModel = require("../Models/user");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;

        const userExists = await userModel.findOne({ email: email });

        if (!userExists) {
            const newUser = new userModel({
                name,
                email,
                photoUrl
            });

            await newUser.save();

            return res.status(200).json({
                message: "User registered successfully",
                user: newUser
            });
        } else {
            return res.status(200).json({
                message: "User already exists",
                user: userExists
            });
        }

    } catch (err) {
        console.log("Error registering user:", err);

        return res.status(500).json({
            error: "Server Error",
            message: err.message
        });
    }
};