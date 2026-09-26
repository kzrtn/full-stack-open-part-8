import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { EDIT_AUTHOR } from "../queries"

const AuthorForm = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: error => console.log(error)
  })

  const submit = event => {
    event.preventDefault()
    editAuthor({
      variables: {
        name,
        setBornTo: Number(year)
      }
    })
    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name} onChange={({target}) => setName(target.value)} />
        </div>
        <div>
          born <input type="number" value={year} onChange={({target}) => setYear(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorForm