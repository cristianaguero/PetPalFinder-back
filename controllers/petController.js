
const Pet = require('../models/PetModel.js');


const getPets = async (req, res) => {
    const pets = await Pet.find({}).populate('ownerId').populate('fostererId');
    res.json(pets);
}

const getPetsByFilter = async (req, res) => {
    const filteredPets = await Pet.find(req.query);
    res.json(filteredPets);
}

const getPetsByQuery = async (req, res) => {

    const { query } = req.query;

    const pets = await Pet.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
            { breed: { $regex: query, $options: 'i' } },
            { color: { $regex: query, $options: 'i' } },
            { bio: { $regex: query, $options: 'i' } },
        ]
    });

    res.json(pets);
}

const addPet = async (req, res) => {
    const pet = new Pet(req.body);

    try {
        await pet.save();
        res.json({ message: 'Pet added successfully'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error })
    }
}

const getPet = async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
}

const updatePet = async (req, res) => {
    const pet = await Pet.findById(req.params._id);
    const { name, type, status, picture, height, weight, color, bio, hypoallergenic, dietaryRestrictions, breed, owner_id } = req.body;

    if(pet) {  
        pet.type = type || pet.type;
        pet.name = name || pet.name;
        pet.status = status || pet.status;
        pet.picture = picture || pet.picture;
        pet.height = height || pet.height;
        pet.weight = weight || pet.weight;
        pet.color = color || pet.color;
        pet.bio = bio || pet.bio;
        pet.hypoallergenic = hypoallergenic;
        pet.dietaryRestrictions = dietaryRestrictions || pet.dietaryRestrictions;
        pet.breed = breed || pet.breed;
        pet.owner_id = owner_id || pet.owner_id;

        try {
            const updatedPet = await pet.save();
            res.json(updatedPet);
        }
        catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error('Pet not found');
        return res.status(400).json({ error: error.message });
    }

}

const deletePet = async (req, res) => {
    const { id } = req.params;

    try {
        await Pet.findByIdAndDelete(id);
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.log(error);
    }

}

const statusPet = async (req, res) => {
    const { id } = req.params;
    const { status, ownerId, fostererId, toBeReturned } = req.body;

    try {
        const updatedPet = await Pet.findByIdAndUpdate(id, { status, ownerId, fostererId, toBeReturned }, { new: true });
        res.json(updatedPet);
    } catch (error) {
        console.log(error);
    }
}

const savePet = async (req, res) => {
    const { id } = req.params;
    const {savedBy} = req.body;

    try {
        await Pet.findByIdAndUpdate(id, { $push: { savedBy } }, { new: true });
        res.json({ message: 'user add as pet watcher' });
    } catch (error) {
        console.log(error);
    }
}

const unsavePet = async (req, res) => {
    const { id } = req.params;
    const {unsavedBy} = req.body;

    try {
        await Pet.findByIdAndUpdate(id, { $pull: { savedBy: unsavedBy } }, { new: true });
        res.json({ message: 'user removed as pet watcher' });
    } catch (error) {
        console.log(error);
    }
}


const returnPet = async (req, res) => {
    const { id } = req.params;
    const { toBeReturned } = req.body;

    try {
        await Pet.findByIdAndUpdate(id, { toBeReturned }, { new: true });
        res.json({ message: 'pet marked as returned' });
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getPets,
    addPet,
    getPet,
    updatePet,
    deletePet,
    statusPet,
    savePet,
    returnPet,
    getPetsByQuery,
    getPetsByFilter,
    unsavePet
}