import React from 'react';
import { Redirect } from 'react-router-dom';

interface UserLogoutPageStae {
    isUserLoggedIn: boolean;
}

export default class UserLoginPage extends React.Component {
    state: UserLogoutPageStae;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            isUserLoggedIn: false,
        }
        localStorage.clear();
    }

    logout = () => {
        localStorage.clear();
        this.setState({
            isUserLoggedIn: false
        });
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/" />
            );
        }
     return 
    }
}
