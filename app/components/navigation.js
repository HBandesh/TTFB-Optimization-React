import React from "react";

export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.users = props.data;
        this.state = {
            selectedUserId: "",
        }
    }

    changeUser = e => {
        const selectedUser = this.users[e.target.dataset.index];
        this.setState({
            selectedUserId: selectedUser.id,
        });
    }

    render() {
        return(
            <section className="new-recruit-section">
                <h2 className="section-heading">New Recruits</h2>
                <h3 className="section-sub-title">Click on names to reveal the complete identity of a recruit</h3>
                <div className="jumbotron">
                    <h4>{this.state.selectedUserId ? (`ID : ${this.state.selectedUserId}`): `Select a name to reveal ID`}</h4>
                </div>
                <article className="avengers-list-wrapper">
                    {this.props.data.map((itm,idx) => 
                        <div key={itm.id} className="card">
                            <img className="card-img-top" src={itm.avatar} alt="avatar image"/>
                            <div className="card-body">
                                <h5 className="card-title">{`${itm.first_name} ${itm.last_name}`}</h5>
                                <button onClick={this.changeUser} data-index={idx} className="btn btn-primary">Reveal ID</button>
                            </div>
                        </div>
                    )}
                </article>
            </section>
        )
    }
}