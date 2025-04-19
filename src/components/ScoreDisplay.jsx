import PropTypes from "prop-types";

function ScoreDisplay({ score, totalQuestions }) {
  const buttonStyle = {
    padding: "10px 15px",
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div>
      <h2>Quiz Completed!</h2>
      <p>
        Your Score: {score} / {totalQuestions}
      </p>
      <button onClick={() => window.location.reload()} style={buttonStyle}>
        Restart Quiz
      </button>
    </div>
  );
}

ScoreDisplay.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

ScoreDisplay.defaultProps = {
  score: 0,
  totalQuestions: 1,
};

export default ScoreDisplay;
