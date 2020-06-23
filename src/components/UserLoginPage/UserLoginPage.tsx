import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface UserLoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class UserLoginPage extends React.Component {
    state: UserLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [event.target.id]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        api(
            'auth/user/login',
            'post',
            {
                username: this.state.username,
                password: this.state.password,
            },
            'user'
        )
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setErrorMessage('System error... Try again!');

                    return;
                }

                if (res.status === 'ok') {
                    if (res.data.statusCode !== undefined) {
                        let message = '';

                        switch (res.data.statusCode) {
                            case -3001: message = 'Unknwon username!'; break;
                            case -3002: message = 'Bad password!'; break;
                        }

                        this.setErrorMessage(message);

                        return;
                    }

                    saveToken('user', res.data.token);
                    saveRefreshToken('user', res.data.refreshToken);

                    this.setLogginState(true);
                }
            });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Redirect to="/client" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="user" />

                <Col md={{ span: 6, offset: 3 }}>
                    <Card bg="light">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt} /> Prijava korisnika
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="text">Korisničko ime:</Form.Label>
                                    <Form.Control type="text" id="username"
                                        value={this.state.username}
                                        onChange={event => this.formInputChanged(event as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Šifra:</Form.Label>
                                    <Form.Control type="password" id="password"
                                        value={this.state.password}
                                        onChange={event => this.formInputChanged(event as any)} />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary"
                                        onClick={() => this.doLogin()}>
                                        Prijava
                                    </Button>
                                </Form.Group>

                            </Form>
                            <Alert variant="danger"
                                className={this.state.errorMessage ? '' : 'd-none'}>
                                {this.state.errorMessage}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }
}
