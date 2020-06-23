import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import DestinationType from '../../Types/DestinationType';
import ApiDestinationDto from '../../dtos/ApiDestinationDto';

interface DestinationState {
    isUserLoggedIn: boolean;
    destinations: DestinationType[];
    countries: [];

    addModal: {
        visible: boolean;
        name: string;
        country: string;
        available: number;
        date: Date;
        message: string;
    };

    editModal: {
        destinationId: number;
        name: string,
        country: string,
        visible: boolean;
        available: number;
        date: string;
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
            countries: [],

            addModal: {
                visible: false,
                name: '',
                country: '',
                available: 0,
                date: new Date(),
                message: '',
            },

            editModal: {
                destinationId: 0,
                visible: false,
                name: '',
                country: '',
                available: 0,
                date: new Date().toISOString().split('T')[0],
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

    private setEditModalBooleanFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: (newValue === 'null') ? null : Boolean(newValue),
            }),
        ));
    }

    private setEditModalDateFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state,
            Object.assign(this.state.editModal, {
                [fieldName]: newValue,
            }),
        ));
    }

    componentWillMount() {
        this.getDestinations();
        this.getCountries();
    }

    private getCountries() {
        fetch('https://restcountries.eu/rest/v2/all')
            .then(response => response.json())
            .then(json => json.map((country: { name: any; }) => country.name))
            .then(countries =>
                this.setStateCountries(countries))
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
                    country: destination.country,
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

    private setStateCountries(countries: []) {
        this.setState(Object.assign(this.state, {
            countries: countries,
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
                            <FontAwesomeIcon icon={faListAlt} /> Destinacije
                        </Card.Title>
                        <Card.Body>
                            <Button variant="primary" size="sm"
                                onClick={() => this.showAddModal()}>
                                <FontAwesomeIcon icon={faPlus} /> Dodaj novu destinaciju
                            </Button>
                        </Card.Body>
                        <Table hover responsive bordered size="sm">
                            <thead>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Ime</th>
                                    <th className="text-right">Zemlja</th>
                                    <th className="text-right">Slobodno</th>
                                    <th className="text-right">Rezervisano</th>
                                    <th className="text-right">Datum putovanja</th>
                                    <th className="text-right">Aktivna</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.destinations.map(destination => (
                                    <tr>
                                        <td className="text-right">{destination.destinationId}</td>
                                        <td>{destination.name}</td>
                                        <td className="text-right">{destination.country}</td>
                                        <td className="text-right">{destination.available}</td>
                                        <td className="text-right">{destination.reserved}</td>
                                        <td className="text-right">{destination.date}</td>

                                        <td className="text-right">
                                            {destination.active ? (
                                                <FontAwesomeIcon icon={faTimes} />
                                            ) : <FontAwesomeIcon icon={faCheck} />}
                                        </td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={() => this.showEditModal(destination)}>
                                                <FontAwesomeIcon icon={faEdit} /> Uredi
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
                            <Form.Label htmlFor="new-name">Ime</Form.Label>
                            <Form.Control type="text" id="new-name"
                                value={this.state.addModal.name}
                                onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-country">Zemlja</Form.Label>
                            <Form.Control as="select" id="country"
                                value={this.state.addModal.country}
                                onChange={(e) => this.setAddModalStringFieldState('country', e.target.value)}>
                                <option value="null">Odaberi zemlju</option>
                                {this.state.countries.map(c => (
                                    <option value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-available">Slobodno</Form.Label>
                            <Form.Control type="text" id="new-available"
                                value={this.state.addModal.available}
                                onChange={(e) => this.setAddModalNumberFieldState('available', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-date">Datum putovanja</Form.Label>
                            <Form.Control type="date" id="new-date"
                                value={this.state.addModal.date?.toString()}
                                onChange={(e) => this.setAddModalDateFieldState('date', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doAdd()}>
                                <FontAwesomeIcon icon={faPlus} /> Dodaj destinaciju
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
                            <Form.Label htmlFor="edit-name">Ime</Form.Label>
                            <Form.Control type="text" id="edit-name"
                                value={this.state.editModal.name}
                                onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-country">Zemlja</Form.Label>
                            <Form.Control as="select" id="country"
                                value={this.state.editModal.country}
                                onChange={(e) => this.setEditModalStringFieldState('country', e.target.value)}>
                                <option value="null">Odaberi zemlju</option>
                                {this.state.countries.map(c => (
                                    <option value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-available">Slobodno</Form.Label>
                            <Form.Control type="text" id="edit-available"
                                value={this.state.editModal.available}
                                onChange={(e) => this.setEditModalNumberFieldState('available', e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-date">Datum</Form.Label>
                            <Form.Control type="date" id="edit-date"
                                value={this.state.editModal.date?.toString()}
                                onChange={(e) => this.setEditModalDateFieldState('date', e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={() => this.doEdit()}>
                                <FontAwesomeIcon icon={faSave} /> Uredi destinaciju
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
        this.setAddModalStringFieldState('country', '');
        this.setAddModalStringFieldState('available', '');
        this.setAddModalNumberFieldState('date', '');

        this.setAddModalVisibleState(true);
    }

    private doAdd() {
        api('/api/destination/', 'post', {
            name: this.state.addModal.name,
            country: this.state.addModal.country,
            available: this.state.addModal.available,
            date: this.state.addModal.date,
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
        this.setEditModalStringFieldState('country', String(destination.country));
        this.setEditModalNumberFieldState('available', String(destination.available));
        this.setEditModalNumberFieldState('reserved', String(destination.reserved));
        this.setEditModalDateFieldState('date', String(destination.date));
        this.setEditModalBooleanFieldState('active', String(destination.active));
        this.setEditModalVisibleState(true);
    }

    private doEdit() {
        api('/api/destination/' + this.state.editModal.destinationId, 'patch', {
            name: this.state.editModal.name,
            country: this.state.editModal.country,
            available: this.state.editModal.available,
            date: this.state.editModal.date,
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
