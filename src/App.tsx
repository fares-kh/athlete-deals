import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Query from './Query'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products/:query" element={<Query />} />
      </Routes>
    </div>
  )
}

export default App