const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const userResolvers = {
    register: {
        type: UserType,
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(_, { username, email, password }) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            return await user.save();
        }
    },
    login: {
        type: GraphQLString,
        args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(_, { email, password }) {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw new Error('Invalid password');

            return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        }
    }
};

module.exports = { UserType, userResolvers };
