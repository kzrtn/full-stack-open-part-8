const Notify = ({ error_message }) => {
  if (!error_message) return null
  return(
    <div style={{ color: 'red'}}>
      {error_message}
    </div>
  )
}

export default Notify