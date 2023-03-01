/**
 * @module Navigation This module implements the functionality and the HTML of new users component
 */

import React, { useState, useRef } from "react";

/**
 * @function generateId This function generates a random ID everytime it is called
 * @returns {String} A random ID
 */
const generateId = () => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export const NewUsers = ({ users }) => {
  const [selectedUserID, setSelectedUserID] = useState("");
  const scollToRef = useRef();

  const changeUser = () => {
    setSelectedUserID(generateId());
    scollToRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section">
      <h2 className="section-heading" ref={scollToRef}>
        New Recruits
      </h2>
      <h3 className="section-sub-title">
        Click on names to reveal the ID of a recruit
      </h3>
      <h4 className="selected-user">
        {selectedUserID
          ? `ID : ${selectedUserID}`
          : `Select a name to reveal ID`}
      </h4>
      <article className="avengers-list-wrapper">
        {users.map((itm, idx) => (
          <div key={itm.id} className="card">
            <img className="card-img-top" src={itm.avatar} alt="avatar image" />
            <div className="card-body">
              <h5 className="card-title">{`${itm.first_name} ${itm.last_name}`}</h5>
              <button
                onClick={changeUser}
                data-index={idx}
                className="btn btn-primary"
              >
                Reveal ID
              </button>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
};
