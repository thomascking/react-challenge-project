import React from 'react';
import { connect } from 'react-redux'; 
import { Route, Redirect } from 'react-router-dom';

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const ProtectedRoute = ({ component: Component, auth, ...rest }) => (
    <Route {...rest} render={(props) => (
      auth.token
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

export default connect(mapStateToProps, null)(ProtectedRoute);