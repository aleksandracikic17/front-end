import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
    showUsers?: boolean;
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    public setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        });
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav >{this.state.items.map(this.makeNavLink)}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    private makeNavLink(item: MainMenuItem) {
        return (
            <Link to={item.link} className="nav-link">
                {item.text}
            </Link>
        )
    }
}