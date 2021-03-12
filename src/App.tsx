import './App.css';
import React, { useState, Dispatch, SetStateAction, MouseEventHandler } from 'react';

const INITIAL_STATE = {
  runningTotal: 0,
  inputs: [] as Array<string>,
  currentDisplay: '',
};

const ERROR_MESSAGE = 'Error!';
const UNDEFINED = 'Undefined';

export const numButtons = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, -1];
export const opButtons = {
  '÷': () => <>&#247;</>,
  '×': () => <>&#215;</>,
  '-': () => <>-</>,
  '+': () => <>+</>,
  '=': () => <>=</>,
};

export const specialButtons = {
  ac: () => <>AC</>,
  'plus-minus': () => <>+/-</>,
  percent: () => <>&#37;</>,
};

const Calc = () => {
  const [runningTotal, setRunningTotal] = useState(INITIAL_STATE.runningTotal);
  const [inputs, setinputs]: [string[], Dispatch<SetStateAction<string[]>>] = useState(INITIAL_STATE.inputs);
  const [currentDisplay, setcurrentDisplay] = useState(INITIAL_STATE.currentDisplay);

  const numButton = (n: number, onCick: MouseEventHandler<HTMLDivElement>) => {
    return (
      <div data-cy={`numButton-${n}`} key={`numButton-${n}`} className={`num-${n === -1 ? 'dot' : n}`} onClick={onCick}>
        {n === -1 ? '.' : n}
      </div>
    );
  };

  const opButton = (op: string, element: () => JSX.Element, onCick: MouseEventHandler<HTMLDivElement>, i: number) => (
    <div data-cy={`opButton-${i}`} key={`opButton-${op}`} className={`op-${i + 1}`} onClick={onCick}>
      {element()}
    </div>
  );

  const spButton = (op: string, element: () => JSX.Element, onCick: MouseEventHandler<HTMLDivElement>) => (
    <div data-cy={`spButton-${op}`} key={`spButton-${op}`} className={`${op} special-code`} onClick={onCick}>
      {element()}
    </div>
  );

  const handleNumPushed = (n: number) => {
    if (currentDisplay === ERROR_MESSAGE) {
      setcurrentDisplay(`${n}`);
    } else {
      let lastInput = inputs[inputs.length - 1];
      lastInput = lastInput === '/' ? '÷' : lastInput;
      lastInput = lastInput === '*' ? '×' : lastInput;

      if (Object.keys(opButtons).includes(lastInput)) {
        // If the last input is an op
        setcurrentDisplay(`${n}`);
        setinputs([...inputs, '']);
      } else {
        if (n === -1) {
          let update;
          if (currentDisplay.includes('.')) {
            update = currentDisplay.split('.').join('') + '.';
          } else {
            update = currentDisplay + '.';
          }
          setcurrentDisplay(update);
        } else {
          if (runningTotal) {
            setRunningTotal(INITIAL_STATE.runningTotal);
            setcurrentDisplay(`${n}`);
          } else {
            setcurrentDisplay(currentDisplay + `${n}`);
          }
        }
      }
    }
  };

  const handleOpPushed = (op: string) => {
    const update = [...inputs, currentDisplay];

    try {
      if (op === '=') {
        const total = eval(update.join(' ')) || 0;
        setRunningTotal(total);
        setinputs(INITIAL_STATE.inputs);
        setcurrentDisplay(total === Infinity ? UNDEFINED : `${total}`);
      } else {
        const inputsCopy = [...inputs];

        let lastInput = inputsCopy[inputsCopy.length - 1];
        lastInput = lastInput === '/' ? '÷' : lastInput;
        lastInput = lastInput === '*' ? '×' : lastInput;

        if (Object.keys(opButtons).includes(lastInput)) {
          // overwrite last input
          inputsCopy.pop();
          inputsCopy.push(op);
          setinputs(inputsCopy);
        } else {
          if (update.length) {
            if (Object.keys(opButtons).includes(op)) {
              op = op === '÷' ? '/' : op;
              op = op === '×' ? '*' : op;
              const total = eval([...update].join(' ')) || 0;
              setcurrentDisplay(total);
              setinputs([...update, op]);
            }
          }
        }
      }
    } catch (e) {
      setcurrentDisplay(ERROR_MESSAGE);
    }
  };

  const handleSpecialPushed = (op: string) => {
    try {
      switch (op) {
        case 'ac':
          setcurrentDisplay(INITIAL_STATE.currentDisplay);
          setinputs(INITIAL_STATE.inputs);
          setRunningTotal(INITIAL_STATE.runningTotal);
          break;
        case 'plus-minus':
          const flip = parseFloat(currentDisplay) * -1;
          setcurrentDisplay(`${flip}`);
          setinputs([`${flip}`]);
          setRunningTotal(flip);
          break;
        case 'percent':
          const pct = parseFloat(currentDisplay) / 100;
          setcurrentDisplay(`${pct}`);
          setinputs([`${pct}`]);
          setRunningTotal(pct);
          break;
        default:
          throw new Error('Invalid Operation');
      }
    } catch (e) {
      throw new Error('Invalid Operation');
    }
  };

  return (
    <div className="App">
      <div className="calc">
        <div className="display" data-cy="display">
          <div id="display-text">{currentDisplay || '0'}</div>
        </div>
        <div className="nums">
          {Object.entries(specialButtons).map(([op, element]) =>
            spButton(op, element, () => {
              handleSpecialPushed(op);
            }),
          )}
          {numButtons.map((n) =>
            numButton(n, () => {
              handleNumPushed(n);
            }),
          )}
        </div>
        <div className="ops">
          {Object.entries(opButtons).map(([op, div], i) =>
            opButton(
              op,
              div,
              async () => {
                handleOpPushed(op);
              },
              i,
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Calc;
