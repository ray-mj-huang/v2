import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { testConnection } from './services/firebase'

const App = (): React.ReactElement => {
  useEffect(() => {
    testConnection()
  }, [])

  return <RouterProvider router={router} />
}

export default App 