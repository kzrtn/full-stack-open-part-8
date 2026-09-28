const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.find({}).countDocuments(),
    authorCount: async () => Author.find({}).countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          throw new GraphQLError('author does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidargs: args.author
            }
          })
        }
        return Book.find({ author: author._id })
      }
      
      if (args.genre) {
        return await Book.find({ genres: args.genre })
      }

      return Book.find({})
    },
    allAuthors: async () => Author.find({}) ,
    me: (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: async (author) => await Book.find({ author }).countDocuments()
  },
  Mutation: {
    addBook: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }
      
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author
        })
        try {
         await author.save()
        } catch (error) {
          throw new GraphQLError('Failed to save author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidargs: args.author,
              error
            }
          })
        }
      }
      const newBook = new Book({
        ...args,
        author: author._id
      })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Failed to save book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidargs: args.author,
            error
          }
        })
      }
      return newBook.populate('author')
    },
    editAuthor: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Failed to save author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidargs: args.author,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        ...args
      })
      return user.save().catch(error => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials'), {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        }
      }

      const userData = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userData, process.env.JWT_SECRET)
      }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    }
  }
}

module.exports = resolvers