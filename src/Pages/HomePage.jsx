import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [tempQuestion, setTempQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...tempQuestion.options];
    newOptions[idx] = value;
    setTempQuestion({ ...tempQuestion, options: newOptions });
  };

  const addQuestion = () => {
    const { question, options, correctIndex } = tempQuestion;
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    const newQuestion = {
      id: questions.length + 1,
      question,
      options,
      correct: options[correctIndex],
    };

    setQuestions([...questions, newQuestion]);
    setTempQuestion({
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    });
  };

  const handleAnswer = (id, selected) => {
    if (!(id in answers)) {
      setAnswers((prev) => ({ ...prev, [id]: selected }));
    }
  };

  useEffect(() => {
    if (quizStarted && Object.keys(answers).length === questions.length) {
      const correctCount = questions.reduce((acc, q) => {
        return acc + (answers[q.id] === q.correct ? 1 : 0);
      }, 0);
      setScore(correctCount);
    }
  }, [answers, quizStarted]);

  return (
    <div className="container my-5">
      {!quizStarted ? (
        <>
          <h2 className="fw-bold mb-4">Krijo Pyetjet</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Shkruaj pyetjen"
              value={tempQuestion.question}
              onChange={(e) =>
                setTempQuestion({ ...tempQuestion, question: e.target.value })
              }
            />

            {tempQuestion.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                className="form-control mb-2"
                placeholder={`Opsioni ${String.fromCharCode(97 + idx)}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            ))}

            <select
              className="form-select mb-3"
              value={tempQuestion.correctIndex}
              onChange={(e) =>
                setTempQuestion({
                  ...tempQuestion,
                  correctIndex: parseInt(e.target.value),
                })
              }
            >
              {tempQuestion.options.map((_, idx) => (
                <option key={idx} value={idx}>
                  Opsioni {String.fromCharCode(97 + idx)} është i saktë
                </option>
              ))}
            </select>

            <button className="btn btn-success me-2" onClick={addQuestion}>
              ➕ Shto Pyetjen
            </button>
            <button
              className="btn btn-primary"
              disabled={questions.length === 0}
              onClick={() => {
                setQuizStarted(true);
                setAnswers({});
                setScore(null);
              }}
            >
              🚀 Fillo Kuizin
            </button>
          </div>

          {questions.length > 0 && (
            <div className="mt-4">
              <h5>Pyetjet e shtuar:</h5>
              <ul className="list-group">
                {questions.map((q) => (
                  <li key={q.id} className="list-group-item">
                    {q.id}. {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="fw-bold mb-4">Kuizi</h2>
          {questions.map((q) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.correct;
            const showResult = selected !== undefined;

            return (
              <div key={q.id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{q.id}. {q.question}</h5>
                  {q.options.map((opt, idx) => {
                    let btnClass = "btn btn-outline-secondary mb-2 w-100 text-start";
                    if (showResult) {
                      if (opt === q.correct) btnClass = "btn btn-success mb-2 w-100 text-start";
                      else if (opt === selected) btnClass = "btn btn-danger mb-2 w-100 text-start";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(q.id, opt)}
                        className={btnClass}
                        disabled={showResult}
                      >
                        {opt}
                      </button>
                    );
                  })}
                  {showResult && (
                    <div className={`alert mt-3 ${isCorrect ? "alert-success" : "alert-danger"}`}>
                      {isCorrect ? "Saktë ✅" : `Gabim ❌ — E saktë: ${q.correct}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

{score !== null && (
  <div className="mt-4">
    {questions.length === 10 ? (
      <div className="alert alert-info fw-bold">
        Përfundove kuizin! Saktë: {score} nga {questions.length}
      </div>
    ) : (
      <div className="alert alert-warning">
        Kuizi nuk ka 10 pyetje – nuk shfaqet rezultati.
      </div>
    )}

    <button
      className="btn btn-warning mt-2"
      onClick={() => {
        setQuizStarted(false);
        setQuestions([]);
        setTempQuestion({
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
        });
        setAnswers({});
        setScore(null);
      }}
    >
      🔄 Rifillo Kuizin
    </button>
  </div>
)}
        </>
      )}
    </div>
  );
};

export default HomePage;
