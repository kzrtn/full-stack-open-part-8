import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Notify from './components/Notify'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
          </>
        ) : (<button onClick={() => setPage('login')}>login</button>)}
      </div>
      <Notify error_message={errorMessage} />

      <Authors show={page === 'authors'} isLoggedIn={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setPage={setPage} />

      <Recommend show={page === 'recommend'}/>

      <LoginForm show={page === 'login'} setToken={setToken} client={client} setPage={setPage} setError={notify} />
      
    </div>
  )
}

export default App
