import React, { Fragment } from "react";
import {Header} from './header'
import {MainContent} from './mainContent';
import {Footer} from './footer';

class App extends React.Component {
	render() {
		return <Fragment>
			<Header />
			<MainContent data = {this.props.content} />
			<Footer />
		</Fragment> 
	}
}
export default App;