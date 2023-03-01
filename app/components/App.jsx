/**
 * This Module contains the top most parent component of the App.
 */
import React from "react";
import { Header } from "./Header.jsx";
import { TopPerformers } from "./TopPerformers.jsx";
import { Footer } from "./Footer.jsx";
import { NewUsers } from "./NewUsers.jsx";

const App = ({ data }) => {
  return (
    <React.Fragment>
      <Header />
      <NewUsers users={data.newUsers} />
      <TopPerformers data={data.topPerformers} />
      <Footer />
    </React.Fragment>
  );
};
export default App;
