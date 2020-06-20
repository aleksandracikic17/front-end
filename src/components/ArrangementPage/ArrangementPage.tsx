import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faCheck, faWindowClose, faUserMinus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArrangementType from '../../Types/ArrangementType';
import ApiArrangementDto from '../../dtos/ApiArrangementDto';
import ApiDestinationDto from '../../dtos/ApiDestinationDto';
import ApiClientDto from '../../dtos/ApiClientDto';
import DestinationType from '../../Types/DestinationType';

interface ArrangementState {
    isUserLoggedIn: boolean;
    arrangements: ArrangementType[];

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

interface DestinationDto {
    destinationName?: string,
}

export default class Client extends React.Component {
    state: ArrangementState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            arrangements: [],

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
                                    destinationName: destinations[arrangement.destinationId].name,
                                    clientId: arrangement.clientId,
                                    clientName: clients[arrangement.clientId].name,
                                    canceled: arrangement.canceled,
                                }));
                                this.setStateArrangements(arrangements);
                            })
                    })
            })
    }


    async getDestinationsDropDown() {
        api('/api/destination', 'get', {}, 'user')
            .then(async (res: ApiResponse) => {
                const destinations: ApiDestinationDto[] = res.data;

                this.setStateDestinations(destinations);
            })
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateDestinations(destinations: DestinationType[]) {
        this.setState(Object.assign(this.state, {
            destinations: destinations,
        }));
    }

    private setStateArrangements(arrangements: ArrangementType[]) {
        this.setState(Object.assign(this.state, {
            arrangements: arrangements,
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

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> Arrangements
                        </Card.Title>

                        <Table hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th colSpan={1}></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={() => this.showAddModal()}>
                                            <FontAwesomeIcon icon={faPlus} /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th className="text-right">Destination id</th>
                                    <th className="text-right">Destination name</th>
                                    <th className="text-right">Client id</th>
                                    <th className="text-right">Client name</th>
                                    <th className="text-right">Active</th>
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
                                                 <FontAwesomeIcon icon={faCheck} />
                                            ) :  <FontAwesomeIcon icon={faTimes} />}
                                        </td>

                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={() => this.showEditModal(arrangement)}>
                                                <FontAwesomeIcon icon={faEdit} /> Edit arrangements
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
                            Add new arrangement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="new-destinationId">Destination id</Form.Label>
                            <Form.Control type="text" id="new-destinationId"
                                value={this.state.addModal.destinationId}
                                onChange={(e) => this.setAddModalNumberFieldState('destinationId', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-destinationName">Destination name</Form.Label>
                            <Form.Control type="text" id="new-destinationName"
                                value={this.state.addModal.destinationName}
                                onChange={(e) => this.setAddModalNumberFieldState('destinationName', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-client">Client</Form.Label>
                            <Form.Control type="text" id="new-client"
                                value={this.state.addModal.clientId}
                                onChange={(e) => this.setAddModalNumberFieldState('clientId', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-clientName">Client name</Form.Label>
                            <Form.Control type="text" id="new-clientName"
                                value={this.state.addModal.clientName}
                                onChange={(e) => this.setAddModalNumberFieldState('clientName', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Add arrangement
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
                            Cancel arrangement
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-canceled">Canceled</Form.Label>
                            <Form.Control type="checkbox" id="edit-canceled"
                                value={this.state.editModal.canceled?.toString()}
                                onChange={(e) => this.setEditModalBooleanFieldState('canceled', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEdit()}>
                                <FontAwesomeIcon icon={faSave} /> Edit arrangement
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
