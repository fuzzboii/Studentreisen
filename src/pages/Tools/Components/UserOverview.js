// React-spesifikt
import { Component } from "react";

// 3rd-party Packages

// Studentreisen-assets og komponenter
import '../CSS/UserOverview.css';

class UserOverview extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userOverview : [
                {"id" : 1, "fnavn" : "Test" , "enavn" : "Testersen"}
            ]
        }
    }

    updateUserOverview() {
        this.setState({
            // Hent slide vi foreløpig er på
            swipeStartSlide: this.state.swipeStartSlide,
        })
    }

    render() {
        return (
                <section>
                    <h1>Brukeroversikt</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fornavn</th>
                                <th>Etternavn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.userOverview.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fnavn}</td>
                                    <td>{user.enavn}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
        )
    }
}

export default UserOverview;