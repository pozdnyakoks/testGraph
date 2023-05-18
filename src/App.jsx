import { useEffect, useState } from 'react';

function App() {
  // апи работает с марта 2020 до февраля 2021 (включительно)
  const [hosp, setHosp] = useState([]);
  const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let maxNumber = 0;

  // you can change month here
  let month = 4;
  if (month < 10) month = `0${month}`;

  useEffect(() => {
    let promises = [];
    let repl;

    for (let i = 1; i < months[month - 1] + 1; i++) {
      if (i < 10) repl = `0${i}`;
      promises.push(
        fetch(
          `https://api.covidtracking.com/v2/us/daily/2020-${month}-${
            i < 10 ? repl : i
          }/simple.json`
        )
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error();
          })
          .catch(() => (promises = []))
      );
    }
    Promise.all(promises)
      .then((data) => setHosp(data))
      .catch(() => {
        return;
      });
  }, [month]);

  maxNumber = tryMax() === 0 ? 10000 : tryMax();

  function tryMax() {
    try {
      return Math.max(
        ...hosp.map((info) => info.data.outcomes.hospitalized.currently)
      );
    } catch (er) {
      return 1000;
    }
  }

  let cells = hosp.map((info, index) => {
    const number =
      info.data === !info.data
        ? 0
        : info.data.outcomes.hospitalized.currently !== null
        ? info.data.outcomes.hospitalized.currently
        : 0;
    let height = 0;
    let percentage = (number * 100) / maxNumber;
    if (percentage <= 10) {
      height = (percentage * 40) / 10;
    } else if (percentage <= 20) {
      height = ((percentage - 10) * 20) / 100 + 40;
    } else if (percentage <= 50) {
      height = ((((percentage - 20) * 100) / 30) * 20) / 100 + 60;
    } else {
      let perc = ((((percentage - 50) * 100) / 50) * 20) / 100;
      height = perc + 80;
    }
    height = height === 0 ? 3 : height;

    return (
      <div
        key={index}
        className='cell'
        style={{
          height: `calc(${height}% - 7px)`,
        }}
      >
        <div className='popup'>{number}</div>
      </div>
    );
  });

  function makeNumbersY() {
    return (
      <div className='left'>
        <span>{maxNumber}</span>
        <span>{Math.round((maxNumber * 50) / 100)}</span>
        <span>{Math.round((maxNumber * 20) / 100)}</span>
        <span>{Math.round((maxNumber * 10) / 100)}</span>
        <span>{Math.round((maxNumber * 5) / 100)}</span>
        <span>0</span>
      </div>
    );
  }

  function makeNumbersX() {
    return (
      <div className='dates'>
        <span>01</span>
        <span>05</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
        <span>25</span>
        <span>{months[month - 1]}</span>
      </div>
    );
  }

  return (
    <>
      <div className='wrapper'>
        <h2 className='title'>Динамика дохода</h2>
        <div className='diagram'>
          <div className='top-block'>
            {makeNumbersY()}
            <div className='graph'>{cells.length > 0 && cells}</div>
          </div>
          {makeNumbersX()}
        </div>
      </div>
    </>
  );
}

export default App;
