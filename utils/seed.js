const connection = require('../config/connection'); // to connect to database
const { User, Thought } = require('../models');

connection.on('error', (err) => err); // handle errors after connecting (listen for events on the connection)

// MY DATA!!!!!
const userData = [
    {
        userName: 'Matt',
        email: 'matt@mail.com',
    },
    {
        userName: 'Champ',
        email: 'champ@mail.com',
    },
    {
        userName: 'Gol D. Roger',
        email: 'golRoger@mail.com'
    },
    {
        userName: 'Ash Ketchum',
        email: 'ash@mail.com'
    }
];

const thoughtTexts = [ 
    'I am having an awesome thought.',
    'This is a bad thought',
    'Happy thoughts, Happy thoughts, doodoodoo',
    'I think this is awesome',
    'Let us go to the beach, beach and go get away',
    'That video game is cool.',
];

const reactionTexts = [
    'Oh wooooooow',
    'That is pretty gooooood',
    'That is bad',
    'Go on a get em',
    'You are doing awesome',
    'This is my reactioin',
    'LOL',
    'BOOOOOOOOOO',
    'That is very very interesting....'
];
// END OF DATA!!!

// Function to get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to get random reactions for each thought
const getReactions = () => {
    const results = []; // empty array to fill
    for(let i = 0; i < 2; i++){
        results.push({
            reactionBody: getRandomArrItem(reactionTexts),
            userName: getRandomArrItem(userData).userName,
        });
    };
    return results; // return array of 2 reactions with random texts made from random users
}

connection.once('open', async () => {

    console.log("Successfully connected to database and ready to seed!");

    // Delete the collections if they exist. I do not want duplicate data!

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
      await connection.dropCollection('users');
    }

    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection('thoughts');
    }

    // Create Thoughts
    const thoughts = []; // create empty array to hold thoughts

    for (let i = 0; i < thoughtTexts.length; i++) { // loop through thoughtTexts array 
        
        const thoughtText = thoughtTexts[i];
        const userName = getRandomArrItem(userData).userName; // random user
        const reactions = getReactions(); // random reactions

        thoughts.push({
            thoughtText,
            userName,
            reactions,
        });
    }

    // Add thoughts to the collection and await the results
    const thoughtData = await Thought.insertMany(thoughts);

    //console.log(thoughtData);

    // Create the Users!!!!!!

    // create empty array of users
    const users = [];

    for (let i = 0; i < userData.length; i++) { // for now create each user
        const userName = userData[i].userName;
        const email = userData[i].email;
        const thoughts = [];
        for (let j = 0; j < thoughtData.length; j++ ) {
            if (userName == thoughtData[j].userName) { // if user names match get that id boy!!!!
                thoughts.push(thoughtData[j]._id);
            }
        }
        users.push({
            userName,
            email,
            thoughts,
        });
    }; 
    
    
    const allUserData = await User.insertMany(users);

    // Now that we have users, we can start giving them friends based upon user ObjectID!

    for(let i = 0; i < (await allUserData).length; i++ ) { // go through each user

        const friends = [];
        let randomNumFriends = Math.floor(Math.random() * userData.length); // random number of friends

        for(let j = 0; j < randomNumFriends; j++){
            if (allUserData[i].userName != userData[j].userName){ // so you're are not friends with yourself
                friends.push(allUserData[j]._id);
            }
        };

        // Now we have to find the user and update their friends list

       await User.findOneAndUpdate({_id: allUserData[i]._id}, {friends: friends} )

    }; // ends first for loop    

    console.log("Sucessfully seeded!");
});