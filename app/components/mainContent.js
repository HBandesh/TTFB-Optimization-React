import React from 'react';
import request from 'superagent';

export class MainContent extends React.Component {

    constructor() {
        super();
    }

    render() {
        return(
            <React.Fragment>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Avatar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((itm,idx) => {
                            return(
                                <tr key={itm.first_name}>
                                    <td key={itm.id}>{itm.id}</td>
                                    <td key={itm.first_name}>{itm.first_name}</td>
                                    <td key={itm.last_name}>{itm.last_name}</td>
                                    <td key={itm.avatar}><img src={itm.avatar}/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <img src="https://www.hdwallpaper.nu/wp-content/uploads/2017/07/thor-1.jpg" alt="Mighty Thor!!!!"/>
            </React.Fragment>
        );
    }
}