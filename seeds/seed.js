const mongoose = require('mongoose');
const User = require('../models/users');
const Thought = require('../models/thoughts');

const seedDB = async () => {
    await User.deleteMany({});
    await Thought.deleteMany({});

    const userData = [
        { username: "JonSnow", email: "jonsnow@thewall.com" },
        { username: "Daenerys", email: "daenerys@dragonstone.com" },
        { username: "Tyrion", email: "tyrion@casterlyrock.com" },
        { username: "AryaStark", email: "aryastark@winterfell.com" }
    ];

    const insertedUsers = await User.insertMany(userData);

    const thoughtData = [
        {
            thoughtText: "When you play the game of thrones, you win or you die.",
            username: "Daenerys",
            reactions: [
                { reactionBody: "There's no middle ground.", username: "Tyrion" }
            ]
        },
        {
            thoughtText: "The North remembers.",
            username: "JonSnow",
            reactions: [
                { reactionBody: "And the mummer’s farce is almost done.", username: "AryaStark" }
            ]
        },
        {
            thoughtText: "I drink and I know things.",
            username: "Tyrion",
            reactions: [
                { reactionBody: "That's what I do.", username: "Daenerys" }
            ]
        }
    ];

    // Prepare and insert thoughts
    for (const thought of thoughtData) {
        const user = insertedUsers.find(u => u.username === thought.username);
        if (user) {
            const newThought = await Thought.create({
                thoughtText: thought.thoughtText,
                username: user._id,
                reactions: thought.reactions.map(reaction => ({
                    reactionBody: reaction.reactionBody,
                    username: insertedUsers.find(u => u.username === reaction.username)._id
                }))
            });
            user.thoughts.push(newThought._id);
            await user.save();
        }
    }

    // Manually assign friends
    const jonSnow = insertedUsers.find(u => u.username === "JonSnow");
    const daenerys = insertedUsers.find(u => u.username === "Daenerys");
    jonSnow.friends.push(daenerys._id);
    daenerys.friends.push(jonSnow._id);
    await jonSnow.save();
    await daenerys.save();

    console.log('Database seeded with Game of Thrones data!');
};

mongoose.connect('mongodb://127.0.0.1:27017/flexisocialDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully!');
    seedDB().then(() => {
        mongoose.disconnect();
        console.log('Database seeding complete and disconnected from MongoDB.');
    });
})
.catch(err => console.log(err));
