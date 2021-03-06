import React from 'react';
import { Container, Card, Form, Col, Alert, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse } from '../../api/api';
import { Link, Redirect } from 'react-router-dom';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface UserRegistrationPageState {
    isRegistrationComplete: boolean;
    message: string;
    formData: {
        username: string;
        password: string;
    };
}

export default class UserRegistrationPage extends React.Component {
    state: UserRegistrationPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            message: '',
            formData: {
                username: '',
                password: '',
            },
        };
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setRegistrationCompleteState(state: boolean) {
        this.setState(Object.assign(this.state, {
            isRegistrationComplete: state,
        }));
    }

    private setFormDataField(fieldName: string, value: any) {
        const newFormData = Object.assign(this.state.formData, {
            [fieldName]: value,
        });

        this.setState(Object.assign(this.state, {
            formData: newFormData,
        }));
    }

    private handleFormInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let fieldName = '';

        switch (event.target.id) {
            case 'username': fieldName = 'username'; break;
            case 'password': fieldName = 'password'; break;
        }

        if (fieldName === '') {
            return;
        }

        this.setFormDataField(fieldName, event.target.value);
    }

    render() {

        if (this.state.isRegistrationComplete === true) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="user" />
                <Col md={{ span: 8, offset: 2 }}>
                    <Card bg="light">
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faUserPlus} /> Registracija korisnika
                            </Card.Title>

                            {
                                this.state.isRegistrationComplete ?
                                    this.renderRegistrationComplete() :
                                    this.renderRegistrationForm()
                            }

                            <Alert variant="danger"
                                className={this.state.message ? '' : 'd-none'}>
                                {this.state.message}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }

    private renderRegistrationComplete() {
        return (
            <>
                <p>Registracija uspesna</p>
                <p>
                    <Link to="/user/login/">Klikni ovde</Link> za prijavu.
                </p>
            </>
        );
    }

    private renderRegistrationForm() {
        return (
            <Form>
                <Row>
                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="username">Korisničko ime:</Form.Label>
                            <Form.Control type="username" id="username"
                                value={this.state.formData.username}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>

                    <Col xs="12" lg="6">
                        <Form.Group>
                            <Form.Label htmlFor="password">Šifra:</Form.Label>
                            <Form.Control type="password" id="password"
                                value={this.state.formData.password}
                                onChange={(event) => this.handleFormInputChange(event as any)} />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group>
                    <Button variant="primary" block
                        onClick={() => this.doRegister()}>
                        <FontAwesomeIcon icon={faUserPlus} /> Registruj se
                    </Button>
                </Form.Group>
            </Form>
        );
    }

    private doRegister() {
        const data = {
            username: this.state.formData.username,
            password: this.state.formData.password,
        };

        api('/auth/user/register', 'post', data, 'user')
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    this.setMessage('There was an error. Please try again.');
                    return;
                }

                if (res.data.statusCode !== undefined) {
                    switch (res.data.statusCode) {
                        case -6001: this.setMessage(res.data.message); break;
                    }
                    return;
                }

                this.setMessage('');
                this.setRegistrationCompleteState(true);
            });
    }
}