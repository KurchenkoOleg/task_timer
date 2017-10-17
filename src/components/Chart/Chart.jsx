import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';


const Chart = function (props) {
  const ComputeChartData = function () {
    const result = [];

    for (let i = 0; i < 24; i += 1) {
      const locDate = new Date();
      locDate.setHours(i);
      locDate.setMinutes(0);
      locDate.setSeconds(0);
      locDate.setMilliseconds(0);

      const locHourStart = locDate.getTime();
      const locHourEnd = locHourStart + (1000 * 60 * 60);
      let locTime = 0;
      for (let j = 0; j < props.tasks.length; j += 1) {
        const task = props.tasks[j];

        let locStart = Number(task.timeStart);
        let locEnd = Number(task.timeEnd);
        if ((locStart < locHourEnd) && (locEnd > locHourStart)) {
          if (locStart < locHourStart) locStart = locHourStart;
          if (locEnd > locHourEnd) locEnd = locHourEnd;
          locTime += (locEnd - locStart) / 1000 / 60;
        }
      }
      result.push({ name: i.toString(), time: locTime });
    }

    return result;
  };

  return (
    <ResponsiveContainer width="90%" height={300}>
      <BarChart
        data={ComputeChartData()}
        margin={
        {
          top: 70, right: 30, left: 20, bottom: 5,
        }
          }
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar
          dataKey="time"
          fill="#8884d8"
          name="Minutes in this hours"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Chart.propTypes = {
//   tasks: PropTypes.ArrayOf(PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     number: PropTypes.number,
//     timeStart: PropTypes.string,
//     timeEnd: PropTypes.string,
//   })).isRequired,
// };
//
// Chart.defaultProps = {
// };

export default Chart;
