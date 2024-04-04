import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Home from './containers/Home'
import Login from './containers/Login'
import Signup from './containers/Signup'
import ResetPassword from './containers/ResetPassword'
import ResetPasswordConfirm from './containers/ResetPasswordConfirm'
import Activate from './containers/Activate'
import AssetInfo from './containers/AssetInfo'
import Layout from './hocs/Layout'
import Dashboard from './containers/Dashboard'
import Transactions from './components/portfolio/Transactions'


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
            <Route path='/activate/:uid/:token' element={<Activate />} />
            <Route path='/asset-info/:symbol' element={<AssetInfo />} />
            <Route path='/home' element={<Home />} />
            <Route path='/dashboard/:pid' element={<Dashboard />} />
            <Route path='/transactions/:pid' element={<Transactions />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App