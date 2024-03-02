const { User, Thought } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {

    // Get all Users
    async getAllUsers(req, res) {
        try {
          const users = await User.find().select('-__v');;
          res.json(users);
        } 
        catch (err) {
          res.status(500).json(err);
        
        }
    },

    // Get a single user
    async getOneUser(req, res) {
        try {
        const user = await User.findOne({ _id: req.params.userId }).populate('thoughts').populate('friends').select('-__v');

        if (!user) {
            return res.status(404).json({message: 'No user is here'});
        }

        res.json(user);
        } 
        catch (err) {
        res.status(500).json(err);
        }
    },

    // Create a user
    async createUser(req, res) {
        try {
          const user = await User.create(req.body);
          res.json(user);
        } 
        catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },

    // Update a user
    async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!user) {
            res.status(404).json({ message: 'No user with this id!'});
          }
    
          res.json(user);
        } 
        catch (err) {
          res.status(500).json(err);
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
          const user = await User.findOneAndDelete({ _id: req.params.userId });
    
          if (!user) {
            res.status(404).json({ message: 'No user with this id!'});
          }
    
          await User.deleteMany({ _id: { $in: user.thoughts } });
          res.json({ message: 'User and their thoughts are deleted'});
        } 
        catch (err) {
          res.status(500).json(err);
        }
    },

};