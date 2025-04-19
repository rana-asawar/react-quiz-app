import PropTypes from 'prop-types';

function QuestionCard({ question, options, handleAnswer }) {
  const cardStyle = {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  };

  const optionsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={cardStyle}>
      <h2>{question}</h2>
      <div style={optionsStyle}>
        {options.length > 0 ? (
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              style={buttonStyle}
              aria-label={`Select option ${option}`}
            >
              {option}
            </button>
          ))
        ) : (
          <p>No options available</p>
        )}
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleAnswer: PropTypes.func.isRequired,
};

QuestionCard.defaultProps = {
  options: [],
};

export default QuestionCard;