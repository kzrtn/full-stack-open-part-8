import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, ALL_GENRES } from "../queries"
import { useState, useEffect } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const [books, setBooks] = useState([])
  const result = useQuery(ALL_BOOKS, {
    variables: { genre }
  })
  const genreResult = useQuery(ALL_GENRES)
  useEffect(() => {
    if (result.data && genreResult.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  if (!props.show) return null
  if (result.loading) {
    return (
      <div>loading...</div>
    )
  }
  const genres = [... new Set(genreResult.data.allBooks.flatMap(g => g.genres))]

  return (
    <div>
      <h2>books</h2>
      <div>{genre ? <>in genre <b>{genre}</b></> : 'showing all genres'}</div>
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
      {genres.map(g => <button key={g} onClick={() => setGenre(g)}>{g}</button>)}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
