import { Route, Routes } from 'react-router'
import { Navigate } from 'react-router'

import Header from './page/Header.tsx'
import Home from './page/Home.tsx'
import Schedule from './page/Schedule.tsx'
import Project from './page/Project.tsx'
import Notice from './page/Notice.tsx'
import Join from './page/Join.tsx'
import SignIn from './page/SignIn.tsx'
import FindId from './page/FindId.tsx'
import FindPw from './page/FindPw.tsx'
import NotFound from './page/NotFound.tsx'
import Footer from './page/Footer.tsx'

export default function App() {
  return (
    <div className="mit-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/Schedule' element={<Schedule/>} />
          <Route path='/Project' element={<Project/>} />
          <Route path='/Notice' element={<Notice/>} />
          <Route path='/Join' element={<Join/>} />
          <Route path='/SignIn' element={<SignIn/>} />
          <Route path='/SignIn/FindID' element={<FindId/>} />
          <Route path='/not-found' element={<NotFound/>} />
          <Route path='*' element={<Navigate to='/not-found' />} />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}
