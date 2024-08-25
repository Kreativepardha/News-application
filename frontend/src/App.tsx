import './App.css'
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { NewsList } from './pages/NewsList'

function App() {

  return (
    <>
     <Routes>
        {/* <Route path='/' element={<RegisterPage />}/> */}
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/' element={<NewsList />}/>

        {/* <Route path='/task' element={< />}/> */}
     </Routes>
    </>
  )
}

export default App
