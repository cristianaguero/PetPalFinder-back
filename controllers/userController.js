const User = require('../models/UserModel.js');
const idGenerator = require('../helpers/idGenerator.js');
const jwtGenerator = require('../helpers/jwtGenerator.js');
const { confirmAccountMail, forgetPasswordMail } = require('../helpers/emails.js');


const createUser = async (req, res) => {

    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        const error = new Error('User already exists');
        return res.status(400).json({ error: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = idGenerator();
        await user.save();

        confirmAccountMail({email: user.email, token: user.token, name: user.name});

        res.json({message: 'User created successfully, please confirm account by email',
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                admin: user.admin,
                token: user.token
            } 
            });
        
    } catch (error) {
        console.log(error.response.data);
    }
};

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('The credentials are not correct');
        return res.status(400).json({ error: error.message });
    }

    if (!user.confirmed) {
        const error = new Error('User is not confirmed');
        return res.status(400).json({ error: error.message });
    }

    if (await user.comparePassword(password)) {
        res.json({
            _id: user._id,
            admin: user.admin,
            name: user.name,
            surname: user.surname,
            token: jwtGenerator(user._id)
        });
    } else {
        const error = new Error('The credentials are not correct');
        return res.status(400).json({ error: error.message });
    }
}

const confirmUser = async (req, res) => {
    const { token } = req.params;
    const userConfirmed = await User.findOne({ token });

    if (!userConfirmed) {
        const error = new Error('Invalid token');
        return res.status(400).json({ error: error.message });
    }

    try {
        userConfirmed.confirmed = true;
        userConfirmed.token = "";
        await userConfirmed.save();
        res.json({ message: 'User confirmed' });
    } catch (error) {
        console.log(error);
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('User does not exist');
        return res.status(400).json({ error: error.message });
    }

    try {
        user.token = idGenerator();
        await user.save();

        forgetPasswordMail({email: user.email, token: user.token, name: user.name});

        res.json({ message: 'We have sent an email with the instructions' });
    } catch (error) {
        console.log(error);
    }
}

const createToken = async (req, res) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id });

    try {
        user.token = idGenerator();
        await user.save();

        res.json({ token: user.token })

    } catch (error) {
        console.log(error);
    }
    
}

const checkToken = async (req, res) => {
    const { token } = req.params;

    const validToken = await User.findOne({ token });

    if (validToken) {
        res.json({ message: 'Token is valid' });
    } else {
        const error = new Error('Invalid token');
        return res.status(400).json({ error: error.message });
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });

    if (user) {
        user.password = password;
        user.token = "";

        try {
            await user.save();
            res.json({ message: 'Password changed' });
        } catch (error) {
            console.log(error);
        }

    } else {
        const error = new Error('Invalid token');
        return res.status(400).json({ error: error.message });
    }
}

const updateProfile = async (req, res) => {
    const { user } = req;
    const { name, surname, phone, bio } = req.body;

    if(user) {
        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.bio = bio || user.bio;
        user.phone = phone || user.phone;

        try {
            await user.save();
            res.json({ message: 'Profile updated' });
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error('Server error');
        return res.status(500).json({ error: error.message });
    }
}

const getUser = async (req, res) => {
    const { user } = req;
    const userComplete = await User.findById(user._id).populate('savedPets').populate('fosteredPets').populate('adoptedPets');
    res.json(userComplete);
}


const getUserByQuery = async (req, res) => {
    const { query } = req.query;

    const users = await User.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { surname: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ]
    });

    res.json(users);
}

const profile = async (req, res) => {
    const { user } = req;
    res.json(user);
}

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password -token -__v -bio').populate('savedPets').populate('fosteredPets').populate('adoptedPets');
    res.json(users);
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        res.json({ message: `User ${user.email} deleted`});

    }
    catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    const { _id } = req.params;
    const { name, surname, phone, confirmed, admin } = req.body;

    try {
        const user = await User.findById(_id);
        if(user) {
            user.name = name || user.name;
            user.surname = surname || user.surname;
            user.phone = phone || user.phone;
            user.admin = admin;
            user.confirmed = confirmed;

            try {
                const updatedUser = await user.save();
                res.json(updatedUser);
            } catch (error) {
                console.log(error);
            }
        } else {
            const error = new Error('Server error');
            return res.status(500).json({ error: error.message });
        }
    }
    catch (error) {
        console.log(error);
    }
}

const fosterPet = async (req, res) => {
    const { id } = req.params;
    const { fosteredPet } = req.body;

    try {
        await User.findById(id).updateOne({ $push: { fosteredPets: fosteredPet } });
        res.json({ message: 'Pet fostered' });
    } catch (error) {
        console.log(error);
    }
}

const adoptPet = async (req, res) => {
    const { id } = req.params;
    const { adoptedPet } = req.body;

    try {
        await User.findById(id).updateOne({ $push: { adoptedPets: adoptedPet } });
        res.json({ message: 'Pet adopted' });
    } catch (error) {
        console.log(error);
    }
}

const savePet = async (req, res) => {
    const { id } = req.params;
    const { savedPet } = req.body;

    try {
        await User.findById(id).updateOne({ $push: { savedPets: savedPet} });
        res.json({ message: 'Pet saved' });
    } catch (error) {
        console.log(error);
    }
}

const unsavePet = async (req, res) => {
    const { id } = req.params;
    const { unsavedPet } = req.body;

    try {
        await User.findById(id).updateOne({ $pull: { savedPets: unsavedPet } });
        res.json({ message: 'Pet unsaved' });
    } catch (error) {
        console.log(error);
    }
}


const returnPet = async (req, res) => {
    const { id } = req.params;
    const { petId } = req.body;
    
    try {
        await User.findById(id).updateOne({ $pull: { fosteredPets: petId, adoptedPets: petId } });
        res.json({ message: 'Pet returned' })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createUser,
    authenticateUser,
    confirmUser,
    forgetPassword,
    checkToken,
    newPassword,
    profile,
    updateProfile,
    getUser,
    createToken,
    getAllUsers,
    deleteUser,
    updateUser,
    getUserByQuery,
    fosterPet,
    adoptPet,
    savePet,
    returnPet,
    unsavePet
};