import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { EDIT_AUTHOR } from "../queries"

const AuthorForm = ({authors}) => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: error => console.log(error)
  })

  const submit = event => {
    event.preventDefault()
    const name = event.target.author.value
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
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select name="author">
            {authors.map(a => (<option value={a.name} id={a.id}>{a.name}</option>))}
          </select>
        </div>
        <div>
          born <input type="number" name="year" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm