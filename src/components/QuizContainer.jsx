import { useState, useEffect } from "react";
import ScoreDisplay from "./ScoreDisplay";
import "./QuizContainer.css";

function QuizContainer() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [category, setCategory] = useState(9);
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalTime, setTotalTime] = useState(0); // Total quiz timer in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const decodeHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  };

  useEffect(() => {
    if (quizStarted) {
      fetch(
        `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`
      )
        .then((response) => response.json())
        .then((data) => {
          const formattedQuestions = data.results.map((item) => ({
            question: decodeHtml(item.question),
            options: [...item.incorrect_answers, item.correct_answer]
              .map((option) => decodeHtml(option))
              .sort(() => Math.random() - 0.5),
            answer: decodeHtml(item.correct_answer),
          }));

          setQuestions(formattedQuestions);
          setAnsweredQuestions(new Array(data.results.length).fill(false));
          setTotalTime(numQuestions * 60); //Set total time (1 min per question)
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          alert("Failed to load questions. Please try again later.");
        });
    }
  }, [quizStarted, category, difficulty, numQuestions]);

  useEffect(() => {
    let timer;
    if (timerActive && totalTime > 0) {
      timer = setInterval(() => {
        setTotalTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            finishQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, totalTime]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimerActive(true);
    setSelectedAnswers([]);
  };

  const handleAnswer = (selectedOption) => {
    setSelectedAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestion] = {
        question: questions[currentQuestion].question,
        correctAnswer: questions[currentQuestion].answer,
        selectedAnswer: selectedOption,
      };
      return updatedAnswers;
    });

    setAnsweredQuestions((prevAnswers) => {
      const updated = [...prevAnswers];
      updated[currentQuestion] = true; 
      return updated;
    });

    // Update score if the answer is correct
    if (selectedOption === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    //Automatically move to next question
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setConfirmFinish(true); // End quiz if it was the last question
    }
  };

  const finishQuiz = () => {
    setShowScore(true);
    setTimerActive(false);
  };

  const renderDetailedResults = () => {
    return (
      <div className="detailed-results">
        <h3>Detailed Results:</h3>
        {questions.map((questionItem, index) => {
          // Check if the user answered the question
          const selectedAnswer = selectedAnswers[index]?.selectedAnswer || "No answer selected";
          const correctAnswer = questionItem.answer;
  
          return (
            <div key={index} className="result-item">
              <hr />
              <p>
                <strong>Question {index + 1}:</strong> {questionItem.question}
              </p>
              <p>
                <strong>Correct Answer:</strong> {correctAnswer}
              </p>
              <p>
                <strong>Your Answer:</strong> {selectedAnswer}
              </p>
            </div>
          );
        })}
      </div>
    );
  };
    

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="options-container">
          <h2>Choose your quiz options:</h2>
          <div className="container">
            <div className="select-group">
              <label>
                Category:
                <select
                  value={category}
                  onChange={(e) => setCategory(Number(e.target.value))}
                >
                  <option value={9}>General Knowledge</option>
                  <option value={11}>Film</option>
                  <option value={17}>Science & Nature</option>
                  <option value={18}>Science: Computers</option>
                  <option value={21}>Sports</option>
                  <option value={19}>Science: Mathametics</option>
                  <option value={23}>History</option>
                  <option value={24}>Politics</option>
                </select>
              </label>
            </div>
            <div className="select-group">
              <label>
                Difficulty:
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>
            <div className="select-group">
              <label>
                Number of Questions:
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </label>
            </div>
          </div>

          <button className="start-quiz-button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : showScore ? (
        <>
          <ScoreDisplay score={score} totalQuestions={questions.length} />
          {renderDetailedResults()}
        </>
      ) : confirmFinish ? (
        <div className="confirm-finish">
          <h3>Are you sure you want to finish the quiz?</h3>
          <button className="lastBtns" onClick={() => setConfirmFinish(false)}>
            Return to Quiz
          </button>
          <button className="lastBtns" onClick={finishQuiz}>
            Finish Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-question-container">
          <div className="question-navigation">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`nav-button ${
                  currentQuestion === index ? "active" : ""
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <h2 className="quiz-question">
            {questions[currentQuestion].question}
          </h2>
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() =>
                  !answeredQuestions[currentQuestion] && handleAnswer(option)
                }
                className={`option-button ${
                  answeredQuestions[currentQuestion] ? "disabled" : ""
                }`}
                disabled={answeredQuestions[currentQuestion]}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="navigation-buttons">
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
          </div>
          <button
            onClick={() => setConfirmFinish(true)}
            className="finish-quiz-button"
          >
            Finish Quiz
          </button>
          <p className="timer">
            Time left for the quiz: {Math.floor(totalTime / 60)}m{" "}
            {totalTime % 60}s
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizContainer;
