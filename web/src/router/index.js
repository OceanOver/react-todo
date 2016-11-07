import React from 'react'
import {Router} from 'react-router'
import Main from '../components/main'
import Login from '../components/login'

export default(history) => (
    <Router history={history}>
        <Router path="/" component={Login} />
        <Router path="/main" component={Main} />
    </Router>
)
