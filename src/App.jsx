import { useEffect, useState } from 'react';

function App() {
  const [hosp, setHosp] = useState([]);
  const MAX_NUMBER = 10000;

  useEffect(() => {
    const promises = [];
    let repl;
    for (let i = 1; i < 31; i++) {
      if (i < 10) repl = `0${i}`;
      promises.push(
        fetch(
          `https://api.covidtracking.com/v2/us/daily/2020-11-${
            i < 10 ? repl : i
          }/simple.json`
        ).then((res) => res.json())
      );
    }
    Promise.all(promises).then((data) => setHosp(data));
  }, []);

  let cells = hosp.map((info, index) => {
    const number = Math.round(info.data.outcomes.hospitalized.currently / 10);
    const height = `${(number * 100) / MAX_NUMBER}`;
    return (
      <div
        key={index}
        className='cell'
        style={{
          height: `${height}%`,
        }}
      >
        <div className='popup'>{number}</div>
      </div>
    );
  });

  return (
    <>
      <div className='wrapper'>
        <h2 className='title'>Динамика дохода</h2>

        <div className='diagram'>
          <div className='top-block'>
            <div className='left'>
              <span>10000</span>
              <span>5000</span>
              <span>2000</span>
              <span>1000</span>
              <span>500</span>
              <span>0</span>
            </div>
            <div className='graph'>{cells}</div>
          </div>
          <div className='dates'>
            <span>01</span>
            <span>05</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
            <span>30</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
