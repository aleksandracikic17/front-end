import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ApiClientDto from '../../dtos/ApiClientDto';
import ClientType from '../../Types/ClientType';

interface ClientState {
    isUserLoggedIn: boolean;
    clients: ClientType[];

    addModal: {
        visible: boolean;
        name: string;
        lastname: string;
        mail: string;
        phone: string;
        message: string;
    };

    editModal: {
        clientId: number;
        visible: boolean;
        name: string;
        lastname: string;
        mail: string;
        phone: string;
        message: string;
    };
}

export default class Client extends React.Component {
    state: ClientState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            clients: [],

            addModal: {
                visible: false,
                name: '',
                lastname: '',
                mail: '',
                phone: '',
                message: '',
            },

            editModal: {
                clientId: 0,
                visible: false,
                name: '',
                lastname: '',
                mail: '',
                phone: '',
                message: '',
            },
        };
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                visible: newState,
            }),
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                visible: newState,
            }),
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
            }),
        ));
    }

    componentWillMount() {
        this.getClients();
    }

    private getClients() {
        api('/api/client', 'get', {}, 'user')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                const data: ApiClientDto[] = res.data;

                const clients: ClientType[] = data.map(client => ({
                    clientId: client.id,
                    name: client.name,
                    lastname: client.lastname,
                    mail: client.mail,
                    phone: client.phone,
                }));

                this.setStateClients(clients);
            });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateClients(clients: ClientType[]) {
        this.setState(Object.assign(this.state, {
            clients: clients,
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
                <RoledMainMenu role="user" />

                <Card bg="light">
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Clients
                        </Card.Title>
                        <Card.Body>
                            <Button variant="primary" size="sm"
                                onClick={() => this.showAddModal()}>
                                <FontAwesomeIcon icon={faPlus} /> Add new client
                            </Button>
                        </Card.Body>
                        <Table hover responsive bordered size="sm">
                            <thead>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th className="text-right">Lastname</th>
                                    <th className="text-right">Mail</th>
                                    <th className="text-right">Phone</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.clients.map(client => (
                                    <tr>
                                        <td className="text-right">{client.clientId}</td>
                                        <td>{client.name}</td>
                                        <td className="text-right">{client.lastname}</td>
                                        <td className="text-right">{client.mail}</td>
                                        <td className="text-right">{client.phone}</td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={() => this.showEditModal(client)}>
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                        </Button>
                                        </td>
                                    </tr>
                                ), this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal centered show={this.state.addModal.visible}
                    onHide={() => this.setAddModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add new client
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="new-name">Name</Form.Label>
                            <Form.Control type="text" id="new-name"
                                value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-lastname">Lastname</Form.Label>
                            <Form.Control type="text" id="new-lastname"
                                value={this.state.addModal.lastname}
                                onChange={(e) => this.setAddModalStringFieldState('lastname', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-mail">Mail</Form.Label>
                            <Form.Control type="text" id="new-mail"
                                value={this.state.addModal.mail}
                                onChange={(e) => this.setAddModalStringFieldState('mail', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-phone">Phone</Form.Label>
                            <Form.Control type="text" id="new-phone"
                                value={this.state.addModal.phone}
                                onChange={(e) => this.setAddModalStringFieldState('phone', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Add client
                            </Button>
                        </Form.Group>

                        {this.state.addModal.message ? (
                            <Alert variant="danger" value={this.state.addModal.message} />
                        ) : ''}
                    </Modal.Body>
                </Modal>

                <Modal centered show={this.state.editModal.visible}
                    onHide={() => this.setEditModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit client
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-name">Name</Form.Label>
                            <Form.Control type="text" id="edit-name"
                                value={this.state.editModal.name}
                                onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-lastname">Lastname</Form.Label>
                            <Form.Control type="text" id="edit-lastname"
                                value={this.state.editModal.lastname}
                                onChange={(e) => this.setEditModalStringFieldState('lastname', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-mail">Mail</Form.Label>
                            <Form.Control type="text" id="edit-mail"
                                value={this.state.editModal.mail}
                                onChange={(e) => this.setEditModalStringFieldState('mail', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-phone">Phone</Form.Label>
                            <Form.Control type="text" id="edit-phone"
                                value={this.state.editModal.phone}
                                onChange={(e) => this.setEditModalStringFieldState('phone', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEdit()}>
                                <FontAwesomeIcon icon={faSave} /> Edit client
                            </Button>
                        </Form.Group>

                        {this.state.editModal.message ? (
                            <Alert variant="danger" value={this.state.editModal.message} />
                        ) : ''}
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('message', '');

        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('lastname', '');
        this.setAddModalStringFieldState('mail', '');
        this.setAddModalStringFieldState('phone', '');

        this.setAddModalVisibleState(true);
    }

    private doAdd() {
        api('/api/client/', 'post', {
            name: this.state.addModal.name,
            lastname: this.state.addModal.lastname,
            mail: this.state.addModal.mail,
            phone: this.state.addModal.phone,
        }, 'user')
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                if (res.status === 'error') {
                    this.setAddModalStringFieldState('message', res.data.toString());
                    return;
                }

                this.getClients();
                this.setAddModalVisibleState(false);
            });
    }

    private showEditModal(client: ClientType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('clientId', client.clientId ? client.clientId?.toString() : 'null');
        this.setEditModalStringFieldState('name', String(client.name));
        this.setEditModalStringFieldState('lastname', String(client.lastname));
        this.setEditModalStringFieldState('mail', String(client.mail));
        this.setEditModalStringFieldState('phone', String(client.phone));
        this.setEditModalVisibleState(true);
    }

    private doEdit() {
        api('/api/client/' + this.state.editModal.clientId, 'patch', {
            name: this.state.editModal.name,
            lastname: this.state.editModal.lastname,
            mail: this.state.editModal.mail,
            phone: this.state.editModal.phone,
        }, 'user')
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                if (res.status === 'error') {
                    this.setEditModalStringFieldState('message', JSON.stringify(res.data));
                    return;
                }

                this.getClients();
                this.setEditModalVisibleState(false);
            });
    }
}
