import { Route, Routes } from 'react-router'

import Home from './page/Home.tsx'
import SignIn from './page/SignIn.tsx'
import Header from './page/Header.tsx'
import Join from './page/Join.tsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/SignIn' element={<SignIn/>} />
      </Routes>
    </>
  )
}
