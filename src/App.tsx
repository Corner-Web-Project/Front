import { Route, Routes } from 'react-router'

import Header from './page/Header.tsx'
import Home from './page/Home.tsx'
import SignIn from './page/SignIn.tsx'
import Join from './page/Join.tsx'
import Project from './page/Project.tsx'
import Schedule from './page/Schedule.tsx'
import Notice from './page/Notice.tsx'
import Footer from './page/Footer.tsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/SignIn' element={<SignIn/>} />
        <Route path='/Join' element={<Join/>} />
        <Route path='/Project' element={<Project/>} />
        <Route path='/Schedule' element={<Schedule/>} />
        <Route path='/Notice' element={<Notice/>} />
      </Routes>
      <Footer/>
    </>
  )
}
