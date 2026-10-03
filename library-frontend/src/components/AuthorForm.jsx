import { useMutation } from "@apollo/client/react"
import { EDIT_AUTHOR } from "../queries"

const AuthorForm = ({authors}) => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: error => console.log(error)
  })

  const submit = event => {
    event.preventDefault()
    const name = event.target.name.value
    const setBornTo = Number(event.target.year.value)

    editAuthor({
      variables: {
        name,
        setBornTo
      }
    })

    event.target.reset()
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select name="name">
              {authors.map(a => (<option value={a.name} id={a.id} key={a.id}>{a.name}</option>))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born <input type="number" name="year" />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm