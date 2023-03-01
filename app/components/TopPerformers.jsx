/**
 * @module TopPerformers This module implements the functionality and the HTML of top performers component
 */
import React from "react";

export const TopPerformers = ({ data }) => {
  return (
    <section className="section">
      <h2 className="section-heading">Our Top Performers of this week</h2>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Sr. No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Avatar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((itm) => {
            return (
              <tr key={itm.first_name}>
                <td key={itm.id}>{itm.id}</td>
                <td key={itm.first_name}>{itm.first_name}</td>
                <td key={itm.last_name}>{itm.last_name}</td>
                <td key={itm.avatar}>
                  <img src={itm.avatar} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
