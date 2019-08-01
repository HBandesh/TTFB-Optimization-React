/**
 * This Module contains the top most parent component of the App.
 */
import React from "react";
import {Header} from './header'
import {MainContent} from './mainContent';
import {Footer} from './footer';
import {Navigation} from './navigation';

const App = ({data}) => {
	return (
		<React.Fragment>
			<Header />
			<Navigation data={data.navigationList}/>
			<MainContent data = {data.mainContent} />
			<Footer />
		</React.Fragment>
	);
}
export default App;