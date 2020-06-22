import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import UserType from '../../Types/UserType';
import ApiUserDto from '../../dtos/ApiUserDto';

interface DestinationState {
    isUserLoggedIn: boolean;
    users: UserType[];

    deleteModal: {
        visible: boolean;
        userId: number;
        message: string;
    };
}

export default class Destination extends React.Component {
    state: DestinationState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            users: [],

            deleteModal: {
                userId: 0,
                visible: false,
                message: '',
            },
        };
    }

    componentWillMount() {
        this.getUsers();
    }

    private getUsers() {
        api('/api/users', 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                const data: ApiUserDto[] = res.data;

                const users: UserType[] = data.map(user => ({
                    userId: user.id,
                    username: user.username,
                }));

                this.setStateUsers(users);
            });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateUsers(users: UserType[]) {
        this.setState(Object.assign(this.state, {
            users: users,
        }));
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="administrator" />

                <Card bg="light">
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Users
                        </Card.Title>
                        <Table hover responsive bordered size="sm">
                            <thead>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Username</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map(user => (
                                    <tr>
                                        <td className="text-right">{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={() => this.showDeleteModal(user)}>
                                                <FontAwesomeIcon icon={faEdit} /> Delete
                                        </Button>
                                        </td>
                                    </tr>
                                ), this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal centered show={this.state.deleteModal.visible}
                    onHide={() => this.setDeleteModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Delete user
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="delete">You can not get back a deleted user!</Form.Label>

                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doDelete()}>
                                CONFIRM
                            </Button>
                        </Form.Group>

                        {this.state.deleteModal.message ? (
                            <Alert variant="danger" value={this.state.deleteModal.message} />
                        ) : ''}
                    </Modal.Body>
                </Modal>

            </Container>
        );
    }

    private setDeleteModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.deleteModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    private setDeleteModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.deleteModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    private setDeleteModalBooleanFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.deleteModal, {
                [fieldName]: (newValue === 'null') ? null : Boolean(newValue),
            }),
        ));
    }


    private setDeleteModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.deleteModal, {
                visible: newState,
            }),
        ));
    }


    private showDeleteModal(user: UserType) {
        this.setDeleteModalStringFieldState('message', '');
        this.setDeleteModalNumberFieldState('userId', user.userId ? user.userId?.toString() : 'null');
        this.setDeleteModalVisibleState(true);
    }

    private doDelete() {
        api('/api/users/' + this.state.deleteModal.userId, 'delete', {
        }, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                if (res.status === 'error') {
                    this.setDeleteModalStringFieldState('message', JSON.stringify(res.data));
                    return;
                }

                this.getUsers();
                this.setDeleteModalVisibleState(false);
            });
    }
}
