import React from 'react';
import { MainMenu, MainMenuItem } from '../MainMenu/MainMenu';
import api, { ApiResponse } from '../../api/api';

interface RoledMainMenuProperties {
    role: 'user' | 'administrator' | 'visitor';
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];
        console.log(this.props.role)
        switch (this.props.role) {
            case 'user':          items = this.getUserMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
            case 'visitor':       items = this.getVisitorMenuItems(); break;
        }

        return (
            <MainMenu items={ items } />
        );
    }

    private getUserMenuItems(): MainMenuItem[] {
        console.log('NEEE ovde')
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Clients", "/client/"),
            new MainMenuItem("Destinations", "/destination/"),
            new MainMenuItem("Arrangements", "/arrangement/"),
            new MainMenuItem("Log out", "/user/logout/"),
        ];
    }

    private getAdministratorMenuItems(): MainMenuItem[] {
        console.log('ovde')
        return [
            new MainMenuItem("Users", "/users/"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }

    private getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("User register", "/user/register/"),
            new MainMenuItem("User log in", "/user/login/"),
            new MainMenuItem("Administrator log in", "/administrator/login/"),
        ];
    }
}
