import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface HomePageState {
    isUserLoggedIn: boolean;
}


class HomePage extends React.Component {
    state: HomePageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
        };
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role='visitor' />
                <Card bg="light">
                    <Card.Body>
                        <Card.Title>
                            This is the internal TA backoffice application. Welcome!
                        </Card.Title>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

}

export default HomePage;
