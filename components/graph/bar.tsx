// components/BarGraph.js
import React from "react";
import styles from "./BarGraph.module.scss";

const BarGraph = () => {
  const ages = [40, 30, 10, 60];
  const years = [2012, 2013, 2014, 2015];

  return (
    <div className={styles.graphContainer}>
      <div className={styles.yAxis}>
        <span>Age</span>
      </div>
      <div className={styles.chart}>
        {ages.map((age, index) => (
          <div
            key={years[index]}
            className={styles.bar}
            style={{ height: `${age * 3}px` }} // scaling height based on age
          >
            <span className={styles.barLabel}>{years[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraph;
