import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArrangementType from '../../Types/ArrangementType';
import ApiArrangementDto from '../../dtos/ApiArrangementDto';
import ApiDestinationDto from '../../dtos/ApiDestinationDto';
import ApiClientDto from '../../dtos/ApiClientDto';
import DestinationType from '../../Types/DestinationType';
import ClientType from '../../Types/ClientType';

interface ArrangementState {
    isUserLoggedIn: boolean;
    arrangements: ArrangementType[];
    destinations: DestinationType[];
    clients: ClientType[];

    addModal: {
        visible: boolean;
        destinationId: number;
        destinationName: string;
        clientId: number;
        clientName: string;
        canceled: boolean;
        message: string;
    };

    editModal: {
        visible: boolean;
        arrangementId: number;
        canceled: boolean;
        message: string;
    };
}

export default class Client extends React.Component {
    state: ArrangementState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            arrangements: [],
            destinations: [],
            clients: [],

            addModal: {
                visible: false,
                destinationId: 0,
                destinationName: '',
                clientId: 0,
                clientName: '',
                canceled: false,
                message: '',
            },

            editModal: {
                arrangementId: 0,
                visible: false,
                canceled: false,
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

    private setAddModalNumberFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: (newValue === 'null') ? null : Number(newValue),
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

    private setEditModalBooleanFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: (newValue === 'null') ? null : Boolean(newValue),
            }),
        ));
    }

    componentWillMount() {
        this.getArrangements();
        this.getDestinationsDropDown();
        this.getClientsDropDown();
    }

    async getArrangements() {
        api('/api/destination', 'get', {}, 'user')
            .then(async (res: ApiResponse) => {
                const destinations: ApiDestinationDto[] = res.data;

                api('/api/client', 'get', {}, 'user')
                    .then(async (res: ApiResponse) => {
                        const clients: ApiClientDto[] = res.data;

                        api('/api/arrangement', 'get', {}, 'user')
                            .then(async (res: ApiResponse) => {
                                const data: ApiArrangementDto[] = res.data;
                                const arrangements: ArrangementType[] = data.map(arrangement => ({
                                    arrangementId: arrangement.id,
                                    destinationId: arrangement.destinationId,
                                    destinationName: destinations[arrangement.destinationId - 1].name,
                                    clientId: arrangement.clientId,
                                    clientName: clients[arrangement.clientId - 1].lastname,
                                    canceled: arrangement.canceled,
                                }));
                                this.setStateArrangements(arrangements);
                            })
                    })
            })
    }


    async getDestinationsDropDown() {
        api('/api/destination', 'get', {}, 'user')
            .then((res: ApiResponse) => {

                const data: ApiDestinationDto[] = res.data;

                const destinations: DestinationType[] = data.map(destination => ({
                    destinationId: destination.id,
                    name: destination.name,
                }));

                this.setStateDestinations(destinations);
            })
    }

    async getClientsDropDown() {
        api('/api/client', 'get', {}, 'user')
            .then((res: ApiResponse) => {

                const data: ApiClientDto[] = res.data;

                const clients: ClientType[] = data.map(client => ({
                    clientId: client.id,
                    name: client.name,
                    lastname: client.lastname,
                }));

                this.setStateClients(clients);
            })
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateArrangements(arrangements: ArrangementType[]) {
        this.setState(Object.assign(this.state, {
            arrangements: arrangements,
        }));
    }

    private setStateDestinations(destinations: DestinationType[]) {
        this.setState(Object.assign(this.state, {
            destinations: destinations,
        }));
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
            <Container >
                <RoledMainMenu role="user" />

                <Card bg="light">
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Aranžmani
                        </Card.Title>
                        <Card.Body>
                            <Button variant="primary" size="sm"
                                onClick={() => this.showAddModal()}>
                                <FontAwesomeIcon icon={faPlus} /> Dodaj novi aranžman
                            </Button>
                        </Card.Body>
                        <Table hover responsive bordered size="sm">
                            <thead>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th className="text-right">ID destinacije</th>
                                    <th className="text-right">Destinacija</th>
                                    <th className="text-right">ID klijenta</th>
                                    <th className="text-right">Klijent</th>
                                    <th className="text-right">Aktivan</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.arrangements.map(arrangement => (
                                    <tr>
                                        <td className="text-right">{arrangement.arrangementId}</td>
                                        <td className="text-right">{arrangement.destinationId}</td>
                                        <td className="text-right">{arrangement.destinationName}</td>
                                        <td className="text-right">{arrangement.clientId}</td>
                                        <td className="text-right">{arrangement.clientName}</td>
                                        <td className="text-right">
                                            {arrangement.canceled ? (
                                                <FontAwesomeIcon icon={faTimes} />
                                            ) : <FontAwesomeIcon icon={faCheck} />}
                                        </td>
                                        <td className="text-center">
                                            {arrangement.canceled ? (
                                                <FontAwesomeIcon icon={faTimes} />
                                            ) :
                                                <Button variant="info" size="sm"
                                                    onClick={() => this.showEditModal(arrangement)}>
                                                    Otkaži aranžman
                                        </Button>}
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
                            Add new arrangement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="new-destinationId">Destinacija</Form.Label>
                            <Form.Control as="select" id="destinationId"
                                value={this.state.addModal.destinationId}
                                onChange={(e) => this.setAddModalNumberFieldState('destinationId', e.target.value)}>
                                <option value="null">Odaberi destinaciju</option>
                                {this.state.destinations.map(d => (
                                    <option value={d.destinationId}>
                                        {d.destinationId}. {d.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-clientId">Klijent</Form.Label>
                            <Form.Control as="select" id="clientId"
                                value={this.state.addModal.clientId}
                                onChange={(e) => this.setAddModalNumberFieldState('clientId', e.target.value)}>
                                <option value="null">Odaberi klijentat</option>
                                {this.state.clients.map(c => (
                                    <option value={c.clientId}>
                                        {c.clientId}. {c.name} {c.lastname}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Dodaj aranžman
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
                            Otkaži aranžman
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-canceled">Ne moze se aktivirati otkazan aranžman!</Form.Label>
                            <Form.Control type="checkbox" id="edit-canceled"
                                value={this.state.editModal.canceled?.toString()}
                                onChange={(e) => this.setEditModalBooleanFieldState('canceled', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEdit()}>
                                Potvrdi
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

        this.setAddModalNumberFieldState('destinationId', '');
        this.setAddModalStringFieldState('destinationName', '');
        this.setAddModalNumberFieldState('clientId', '');
        this.setAddModalStringFieldState('clientName', '');

        this.setAddModalVisibleState(true);
    }

    private doAdd() {
        api('/api/arrangement/', 'post', {
            destinationId: this.state.addModal.destinationId,
            clientId: this.state.addModal.clientId,
            canceled: this.state.addModal.canceled,
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

                this.getArrangements();
                this.setAddModalVisibleState(false);
            });
    }

    private showEditModal(arrangement: ArrangementType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('arrangementId', arrangement.arrangementId ? arrangement.arrangementId?.toString() : 'null');
        this.setEditModalNumberFieldState('canceled', String(arrangement.canceled));
        this.setEditModalVisibleState(true);
    }

    private doEdit() {
        api('/api/arrangement/' + this.state.editModal.arrangementId, 'patch', {
            canceled: this.state.editModal.canceled,
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

                this.getArrangements();
                this.setEditModalVisibleState(false);
            });
    }
}

