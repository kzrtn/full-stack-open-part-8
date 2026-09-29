import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { LOGIN } from "../queries"

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      const token = data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
      props.setPage('authors')
    },
    onError: error => console.log(error)
  })

  if (!props.show) return null

  const submit = (event) => {
    event.preventDefault()
    login({
      variables: {
        username,
        password
      }
    })
    
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input value={username} onChange={({target}) => setUsername(target.value)} />
        </div>  
        <div>
          password
          <input type="password" value={password} onChange={({target}) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm