const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')

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
    allAuthors: async () => Author.find({}) 
  },
  Author: {
    bookCount: async (author) => await Book.find({ author }).countDocuments()
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers