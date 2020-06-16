import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import DestinationType from '../../Types/DestinationType';
import ApiDestinationDto from '../../dtos/ApiDestinationDto';

interface DestinationState {
    isUserLoggedIn: boolean;
    destinations: DestinationType[];

    addModal: {
        visible: boolean;
        name: string;
        available: number;
        reserved: number;
        date: Date;
        active: boolean;
        message: string;
    };

    editModal: {
        destinationId: number;
        name: string,
        visible: boolean;
        available: number;
        reserved: number;
        date: string;
        active: boolean;
        message: string;
    };
}

export default class Destination extends React.Component {
    state: DestinationState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            destinations: [],

            addModal: {
                visible: false,
                name: '',
                available: 0,
                reserved: 0,
                date: new Date(),
                active: false,
                message: '',
            },

            editModal: {
                destinationId: 0,
                visible: false,
                name: '',
                available: 0,
                reserved: 0,
                date: new Date().toISOString().split('T')[0],
                active: false,
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

    private setAddModalDateFieldState(fieldName: string, newValue: string) {
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


    private setEditModalDateFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.addModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    componentWillMount() {
        this.getDestinations();
    }

    private getDestinations() {
        api('/api/destination', 'get', {}, 'user')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                const data: ApiDestinationDto[] = res.data;
                
                const destinations: DestinationType[] = data.map(destination => ({
                    destinationId: destination.id,
                    name: destination.name,
                    available: destination.available,
                    reserved: destination.reserved,
                    date: destination.date,
                    active: destination.active,
                }));
                
                this.setStateDestinations(destinations);
            });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private setStateDestinations(destinations: DestinationType[]) {
        this.setState(Object.assign(this.state, {
            destinations: destinations,
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
                            <FontAwesomeIcon icon={faListAlt} /> Destinations
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
                                    <th>Name</th>
                                    <th className="text-right">Available</th>
                                    <th className="text-right">Reserved</th>
                                    <th className="text-right">Date</th>
                                    <th className="text-right">Active</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.destinations.map(destination => (
                                    <tr>
                                        <td className="text-right">{destination.destinationId}</td>
                                        <td>{destination.name}</td>
                                        <td className="text-right">{destination.available}</td>
                                        <td className="text-right">{destination.reserved}</td>
                                        <td className="text-right">{destination.date}</td>
                                        <td className="text-right">{destination.active}</td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={() => this.showEditModal(destination)}>
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
                            Add new destination
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
                            <Form.Label htmlFor="new-available">Available</Form.Label>
                            <Form.Control type="text" id="new-available"
                                value={this.state.addModal.available}
                                onChange={(e) => this.setAddModalNumberFieldState('available', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-reserved">Reserved</Form.Label>
                            <Form.Control type="text" id="new-reserved"
                                value={this.state.addModal.reserved}
                                onChange={(e) => this.setAddModalNumberFieldState('reserved', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-date">Date</Form.Label>
                            <Form.Control type="date" id="new-date"
                                value={this.state.addModal.date?.toString()}
                                onChange={(e) => this.setAddModalDateFieldState('date', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-active">Active</Form.Label>
                            <Form.Control type="checkbox" id="new-active"
                                value={this.state.addModal.active?.toString()}
                                onChange={(e) => this.setAddModalNumberFieldState('active', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Add destination
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
                            Edit destinations
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
                            <Form.Label htmlFor="edit-available">Available</Form.Label>
                            <Form.Control type="text" id="edit-available"
                                value={this.state.editModal.available}
                                onChange={(e) => this.setEditModalNumberFieldState('available', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-reserved">Reserved</Form.Label>
                            <Form.Control type="text" id="edit-reserved"
                                value={this.state.editModal.reserved?.toString()}
                                onChange={(e) => this.setEditModalNumberFieldState('reserved', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-date">Date</Form.Label>
                            <Form.Control type="date" id="edit-date"
                                value={this.state.editModal.date?.toString()}
                                onChange={(e) => this.setEditModalDateFieldState('date', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-active">Active</Form.Label>
                            <Form.Control type="checkbox" id="edit-active"
                                value={this.state.editModal.active?.toString()}
                                onChange={(e) => this.setEditModalNumberFieldState('active', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEdit()}>
                                <FontAwesomeIcon icon={faSave} /> Edit destination
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
        this.setAddModalStringFieldState('available', '');
        this.setAddModalNumberFieldState('reserved', '');
        this.setAddModalNumberFieldState('date', '');
        this.setAddModalNumberFieldState('active', '');

        this.setAddModalVisibleState(true);
    }

    private doAdd() {
        api('/api/destination/', 'post', {
            name: this.state.addModal.name,
            available: this.state.addModal.available,
            reserved: this.state.addModal.reserved,
            date: this.state.addModal.date,
            active: this.state.addModal.active,
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

                this.getDestinations();
                this.setAddModalVisibleState(false);
            });
    }

    private showEditModal(destination: DestinationType) {
        this.setEditModalStringFieldState('message', '');
        this.setEditModalNumberFieldState('destinationId', destination.destinationId ? destination.destinationId?.toString() : 'null');
        this.setEditModalStringFieldState('name', String(destination.name));
        this.setEditModalNumberFieldState('available', String(destination.available));
        this.setEditModalNumberFieldState('reserved', String(destination.reserved));
        this.setEditModalDateFieldState('date', String(destination.date));
        this.setEditModalNumberFieldState('active', String(destination.active));
        this.setEditModalVisibleState(true);
    }

    private doEdit() {
        api('/api/destination/' + this.state.editModal.destinationId, 'patch', {
            name: this.state.editModal.name,
            available: this.state.editModal.available,
            reserved: this.state.editModal.reserved,
            date: this.state.editModal.date,
            active: this.state.editModal.active,
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

                this.getDestinations();
                this.setEditModalVisibleState(false);
            });
    }
}
