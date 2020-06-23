import React from 'react';
import { MainMenu, MainMenuItem } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'user' | 'administrator' | 'visitor';
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];
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
        return [
            new MainMenuItem("Klijenti", "/client/"),
            new MainMenuItem("Destinacije", "/destination/"),
            new MainMenuItem("Aranžmani", "/arrangement/"),
            new MainMenuItem("Odjava", "/user/logout/"),
        ];
    }

    private getAdministratorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Korisnici", "/users/"),
            new MainMenuItem("Odjava", "/user/logout/"),
        ];
    }

    private getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Registracija korisnika", "/user/register/"),
            new MainMenuItem("Prijava korisnika", "/user/login/"),
            new MainMenuItem("Prijava administratora", "/administrator/login/"),
        ];
    }
}
