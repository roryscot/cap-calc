import './App.css';
import React, { MouseEvent } from 'react';

const numButton = (n: number, onCick: (e: MouseEvent) => void) => (
  <div key={`numButton-${n}`} className={`num-${n === -1 ? 'dot' : n}`} onClick={onCick}>
    {n === -1 ? '.' : n}
  </div>
);

const opButton = (o: () => JSX.Element, onCick: (e: MouseEvent) => void, i: number) => (
  <div key={`opButton-${i}`} className={`op-${i + 1}`} onClick={onCick}>
    {o()}
  </div>
);

const spButton = (key: string, s: () => JSX.Element, onCick: (e: MouseEvent) => void, i: number) => (
  <div key={`spButton-${key}`} className={`${key} special-code`} onClick={onCick}>
    {s()}
  </div>
);

const handleNumPushed = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  console.log(target.innerHTML);
};

const handleOpPushed = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  console.log(target.innerHTML);
};

const handleSpecialPushed = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  console.log(target.innerHTML);
};

const Calc = () => {
  const buttonNums = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, -1];
  const opButtons = [() => <>&#247;</>, () => <>&#215;</>, () => <>-</>, () => <>+</>, () => <>=</>];
  const specialButtons = {
    ac: () => <> AC </>,
    'plus-minus': () => <> +/- </>,
    percent: () => <> &#37; </>,
  };

  return (
    <div className="App">
      <div className="calc">
        <div className="display">
          <div id="display-text"> 0 </div>
        </div>
        <div className="nums">
          {Object.entries(specialButtons).map(([k, v], i) =>
            spButton(k, v as () => JSX.Element, handleSpecialPushed, i),
          )}
          {buttonNums.map((n) => numButton(n, handleNumPushed))}
        </div>
        <div className="ops">{opButtons.map((o, i) => opButton(o as () => JSX.Element, handleOpPushed, i))}</div>
      </div>
    </div>
  );
};

export default Calc;
