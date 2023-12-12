const express = require('express');
const userRouter = express.Router();

const { createUser,
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
    adoptPet,
    fosterPet,
    savePet,
    unsavePet,
    returnPet
} = require('../controllers/userController.js');

const checkAuth = require('../middleware/checkAuth.js');

userRouter.post('/login', authenticateUser);

userRouter.post('/signup', createUser);
userRouter.get('/confirm-account/:token', confirmUser);

userRouter.post('/forget-password', forgetPassword);
userRouter.get('/forget-password/:token', checkToken);
userRouter.post('/forget-password/:token', newPassword);

userRouter.get('/profile', checkAuth, profile);
userRouter.get('/user', checkAuth, getUser);
userRouter.get('/search', checkAuth, getUserByQuery);
userRouter.get('/users', checkAuth, getAllUsers);
userRouter.put('/profile', checkAuth, updateProfile);
userRouter.put('/update-user/:_id', checkAuth, updateUser);
userRouter.get('/update-password', checkAuth, createToken);

userRouter.put('/:id/adoptPet', checkAuth, adoptPet);
userRouter.put('/:id/fosterPet', checkAuth, fosterPet);
userRouter.put('/:id/savePet', checkAuth, savePet);
userRouter.put('/:id/unsavePet', checkAuth, unsavePet);
userRouter.put('/:id/returnPet', checkAuth, returnPet);

userRouter.delete('/delete-user/:id', checkAuth, deleteUser)

module.exports = userRouter;
