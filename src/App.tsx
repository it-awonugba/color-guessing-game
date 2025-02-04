import { useReducer } from "react";
import "./App.css";

interface GameState {
  gameStatus: string | null;
  score: number;
  colors: string[];
  targetColor: string;
  resultAnimation: string;
}

interface InitializeGameAction {
  type: "StartGame";
  payload: { targetColor: string; colors: string[] };
}

interface GradeGameAction {
  type: "GradeGame";
  payload: {
    status: string;
    score: number;
    resultAnimation: string;
    colors?: string[];
    targetColor?: string;
  };
}

type GameAction = InitializeGameAction | GradeGameAction;

const initialState: GameState = {
  gameStatus: null,
  score: 0,
  colors: ["#0000FF", "#00FF00", "#FF0000", "#FFFF00", "#FF00FF", "#00FFFFFF"],
  targetColor: "",
  resultAnimation: "",
};

function reducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "StartGame": {
      return {
        ...state,
        gameStatus: null,
        score: 0,
        targetColor: action.payload.targetColor,
        resultAnimation: "",
        colors: [...action.payload.colors],
      };
    }
    case "GradeGame": {
      return {
        gameStatus: action.payload.status,
        score: action.payload.score,
        resultAnimation: action.payload.resultAnimation,
        colors: action.payload.colors ? action.payload.colors : state.colors,
        targetColor: action.payload.targetColor
          ? action.payload.targetColor
          : state.targetColor,
      };
    }
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const resetGame = () => {
    const targetColor =
      state.colors[Math.floor(Math.random() * state.colors.length)];
    const colors = state.colors.sort(() => Math.random() - 0.5);

    return { targetColor, colors };
  };

  const handleStartNewGame = () => {
    const { targetColor, colors } = resetGame();
    dispatch({
      type: "StartGame",
      payload: { targetColor, colors },
    });
  };

  const guessTargetColor = (color: string) => {
    if (color === state.targetColor) {
      const { targetColor, colors } = resetGame();
      dispatch({
        type: "GradeGame",
        payload: {
          status: "Correct!",
          score: state.score + 1,
          resultAnimation: "celebrate",
          colors,
          targetColor,
        },
      });
    } else {
      dispatch({
        type: "GradeGame",
        payload: {
          status: "Wrong",
          score: state.score,
          resultAnimation: "fade-out",
        },
      });
    }
  };

  return (
    <section className="container">
      <h1>Color Guessing Game</h1>
      <div
        className="color-box"
        data-testid="colorBox"
        style={{ backgroundColor: state.targetColor }}
      >
        {state.targetColor ? state.targetColor : "Random color"}
      </div>
      <h2 data-testid="gameInstructions">Guess the correct color!</h2>

      <div className="options">
        {state.colors.map((color, index) => (
          <button
            className="color-option"
            data-testid="colorOption"
            key={index}
            style={{ backgroundColor: color }}
            onClick={() => guessTargetColor(color)}
          >
            {color}
          </button>
        ))}
      </div>
      <div data-testid="gameStatus" className={state.resultAnimation}>
        {state.gameStatus ? `Game Status: ${state.gameStatus}` : ""}
      </div>
      <div data-testid="score">Score: {state.score}</div>

      <button
        className="btn-outline"
        data-testid="newGameButton"
        onClick={handleStartNewGame}
      >
        Start Game
      </button>
    </section>
  );
}

export default App;
