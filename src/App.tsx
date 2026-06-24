import { Route, Routes } from 'react-router'

import Header from './page/Header.tsx'
import Home from './page/Home.tsx'
import SignIn from './page/SignIn.tsx'
import Join from './page/Join.tsx'
import Footer from './page/Footer.tsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/SignIn' element={<SignIn/>} />
        <Route path='/Join' element={<Join/>} />
      </Routes>
      <Footer/>
    </>
  )
}
