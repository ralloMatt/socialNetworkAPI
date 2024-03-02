const {Thought } = require('../models');

module.exports = {

    // Get all thoughts
    async getAllThoughts(req, res) {
        try {
          const thoughts = await Thought.find().select('-__v');;
          res.json(thoughts);
        } 
        catch (err) {
          res.status(500).json(err);
        
        }
    },

    // Get a single thought
    async getOneThought(req, res) {
        try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions').select('-__v');

        if (!thought) {
            return res.status(404).json({message: 'No thought was found!'});
        }

        res.json(thought);
        } 
        catch (err) {
        res.status(500).json(err);
        }
    },

    // Create a thought
    async createThought(req, res) {
        try {
          const thought = await Thought.create(req.body);
          res.json(thought);
        } 
        catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },

    // Update a thought
    async updateThought(req, res) {
        try {
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          );
    
          if (!thought) {
            res.status(404).json({ message: 'No thought with this id!'});
          }
    
          res.json(thought);
        } 
        catch (err) {
          res.status(500).json(err);
        }
    },

    // Delete a thought
    async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
    
          if (!thought) {
            res.status(404).json({ message: 'No thought with this id!'});
          }
    
          await Thought.deleteMany({ _id: { $in: thought.reactions } });
          res.json({ message: 'Thought and its reactions was deleted'});
        } 
        catch (err) {
          res.status(500).json(err);
        }
    },

        // Add a reaction
        async addReaction(req, res) {
            try {
              const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                res.status(404).json({ message: 'No thought with this id!'});
              }
        
              res.json(thought);
            } 
            catch (err) {
              res.status(500).json(err);
            }
        },
    
        // Delete a reaction
        async deleteReaction(req, res) {
            try {
              const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } }},
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                res.status(404).json({ message: 'No thought with this id!'});
              }
        
              res.json(thought);
            } 
            catch (err) {
              res.status(500).json(err);
            }
        },
};