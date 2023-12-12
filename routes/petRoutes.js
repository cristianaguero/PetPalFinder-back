const express = require('express');
const petRouter = express.Router();

const { getPets,
    addPet,
    getPet,
    updatePet,
    deletePet,
    statusPet,
    savePet,
    returnPet,
    getPetsByQuery,
    getPetsByFilter,
    unsavePet } = require('../controllers/petController.js');

const checkAuth = require('../middleware/checkAuth.js');

petRouter.get('/', getPets);
petRouter.get('/filter', getPetsByFilter);
petRouter.get('/search', getPetsByQuery);
petRouter.get('/:id', getPet);

petRouter.put('/:id/status', checkAuth, statusPet);
petRouter.put('/:id/save', checkAuth, savePet);
petRouter.put('/:id/unsave', checkAuth, unsavePet);
petRouter.put('/:id/return', checkAuth, returnPet);

petRouter.post('/', checkAuth, addPet);
petRouter.put('/update-pet/:_id', checkAuth, updatePet);
petRouter.delete('/delete-pet/:id', checkAuth, deletePet);

module.exports = petRouter;