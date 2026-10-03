import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, ME } from "../queries"

const Recommend = (props) => {
  const userResult = useQuery(ME)
  const genre = userResult.data?.me?.favoriteGenre
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  })
  if (!props.show) return null

  if (userResult.loading || result.loading) {
    return <div>loading...</div>
  }
  const books = result.data?.allBooks ?? []

  if (!props.show) return null
  if (result.loading) {
    return (
      <div>loading...</div>
    )
  }
  
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <b>{genre}</b></div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
