import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Mainpage from './mainpage'

const Home = () => {
  return (
    <div>
        <Routes>
            <Route path='/mainpage' element={<Mainpage />} />
        </Routes>
    </div>
  )
}

export default Home