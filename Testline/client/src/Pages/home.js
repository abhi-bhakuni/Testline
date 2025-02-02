import { React, useState, useEffect } from "react";
import { apiData } from "./serverAPI";
import "./home.css"

function Home() {
    const [check, setCheck] = useState(false)
    const [checkQuiz, setcheckQuiz] = useState(false)
    const [rules, setRules] = useState([])
    const [quiz, setQuiz] = useState([])
    const [points, setPoints] = useState(0)
    const [quesNo, setquesNo] = useState(0)
    const [totalQues, settotalQues] = useState(10)
    const [answer, setanswer] = useState([])

    const [time, setTime] = useState({})

    const handleData = () => {
        const result = apiData()
        result.then(res => {
            setRules(data => [
                ...data,
                `Title is "${res.title}"`,
                `Topic is "${res.topic}"`,
                `Test duration is ${res.duration} minutes`,
                `For every correct answer, ${res.correct_answer_marks} marks will be granted`,
                `For every incorrect answer, ${res.negative_marks} marks will be deducted`,
                `Total number of questions: ${res.questions_count} questions`
            ])

            setQuiz(res.questions)

            settotalQues(res.questions_count)

            setTime({ minutes: res.duration, seconds: 0 })
        })
        setCheck(true)
    }

    const handleCorrectOption = (index) => {
        if (quiz[quesNo].options[index].is_correct === true) {
            setPoints((val) => val + 4)
        } else {
            setPoints((val) => val - 1)
        }
        setanswer((ans) => [...ans, [index, quiz[quesNo].options[index].is_correct]])
        setquesNo((val) => val + 1)
    }

    const handleAgain = () => {
        setCheck(false)
        setcheckQuiz(false)
        setRules([])
        setQuiz([])
        setPoints(0)
        setquesNo(0)
        settotalQues(0)
    }

    useEffect(() => {
        if (!checkQuiz) return

        const timer = setInterval(() => {
            setTime((t) => {
                if (t.minutes === 0 && t.seconds === 0) {
                    setquesNo(totalQues)
                    clearInterval(timer)
                    return { minutes: 0, seconds: 0 }
                }

                if (t.seconds === 0) {
                    return { minutes: t.minutes - 1, seconds: 59 }
                }

                return { ...t, seconds: t.seconds - 1 }
            });
        }, 1000);

        return () => {
            clearInterval(timer)
        }
    }, [checkQuiz])

    return (
        <div className="container">
            {!check &&
                <div className="start-quiz">
                    <button onClick={handleData} className="start-quiz-button">Start Testline Quiz</button>
                </div>
            }
            {check &&
                <>
                    <div className="quiz-rules">
                        <h1>Instructions</h1>
                        {
                            rules.map((val, index) => (
                                <li key={index}>{val}</li>
                            ))
                        }
                    </div>
                    <div className="quiz">
                        {!checkQuiz && quesNo < totalQues &&
                            <button className="start-quiz-button2" onClick={() => setcheckQuiz(true)}>Let's Start</button>
                        }
                        {checkQuiz && quesNo < totalQues &&
                            <div className="quiz-number">
                                <p>Question {quesNo} of 10</p>
                                <p>Your Points: {points}</p>
                                <p>Time: {String(time.minutes).padStart(2, "0")}:{String(time.seconds).padStart(2, "0")}</p>
                            </div>
                        }
                        {quesNo === totalQues &&
                            <div className="score-card">
                                <h1>Your Score-Card</h1>
                                <p>Total Points Scored: {points}</p>
                            </div>
                        }
                        {checkQuiz && quesNo < totalQues &&
                            <div className="quiz-slot">
                                <div className="quiz-question">
                                    <p>{quesNo + 1}.</p>
                                    <p>{quiz[quesNo].description}</p>
                                    <p>({quiz[quesNo].topic})</p>
                                </div>
                                <div className="quiz-options">
                                    <ol>
                                        {
                                            quiz[quesNo].options.map((option, index) => (
                                                <li key={index}>
                                                    <p className="quiz-option" onClick={() => handleCorrectOption(index)}>
                                                        {option.description}
                                                    </p>
                                                </li>
                                            ))
                                        }
                                    </ol>
                                </div>
                            </div>
                        }
                        {checkQuiz && quesNo === totalQues &&
                            (
                                quiz.map((ques, index) => (
                                    <div className="quiz-slot" key={index}>
                                        <div className="quiz-question">
                                            <p>{index + 1}.</p>
                                            <p>{ques.description}</p>
                                            <p>({ques.topic})</p>
                                        </div>
                                        <div className="quiz-options">
                                            <ol>
                                                {
                                                    ques.options.map((option, i) => (
                                                        <li key={i}>
                                                            {answer[index][0] === i ?
                                                                (answer[index][1] ?
                                                                    <p className="quiz-option" style={{'background-color': 'green'}}>
                                                                        {option.description}
                                                                    </p> : <p className="quiz-option" style={{'background-color': 'blue'}}>
                                                                        {option.description}
                                                                    </p>
                                                                ) : <p className="quiz-option">
                                                                    {option.description}
                                                                </p>
                                                            }
                                                        </li>
                                                    ))
                                                }
                                            </ol>
                                        </div>
                                        <div className="quiz-solution">{ques.detailed_solution}</div>
                                    </div>
                                ))
                            )
                        }
                        {quesNo === totalQues &&
                            <button className="start-quiz-button3" onClick={handleAgain}>Try Again!</button>
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default Home;
