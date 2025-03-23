// App.js
import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const handleError = error => {
  toast(error.message, { type: "error" });
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [currentState, setCurrentState] = useState("welcome");
  const [careers, setCareers] = useState([]);
  const [roadmap, setRoadmap] = useState("");
  const [selectedCareers, setSelectedCareers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const addMessage = (text, isUser = false) => {
    setMessages(prevMessages => [...prevMessages, { text, isUser }]);
  };

  const handleInputChange = e => {
    setInput(e.target.value);
  };

  const articalize = word => {
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(word[0].toLowerCase()) ? `an` : `a`;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (input.trim() === "") return;

    addMessage(input, true);
    processInput(input);
    setInput("");
  };

  const getCareers = async () => {
    try {
      addMessage("Getting Career Paths from our database...");
      const response = await axios.get(`${backendURL}/api/careers`);
      setCareers(response.data.data);
      return response.data.data;
    } catch (error) {
      handleError(error);
    }
  };

  const processInput = userInput => {
    setWaitingForInput(false);

    if (currentState === "welcome") {
      try {
        const choice = parseInt(userInput);
        if (choice === 1) {
          getCareers().then(careers => {
            setCurrentState("showCareers");
            addMessage("Here are all career paths available on SheLearns:");
            showAllCareers(careers);
          });
        } else if (choice === 2) {
          if (!careers.length) {
            getCareers().then(careers => {
              setCurrentState("searchCareer");
              addMessage("Please enter the career path you are interested in:");
              setWaitingForInput(true);
            });
          } else {
            setCurrentState("searchCareer");
            addMessage("Please enter the career path you are interested in:");
            setWaitingForInput(true);
          }
        } else if (choice === 3) {
          addMessage("Thank you for using SheLearns!");
        } else {
          addMessage("Invalid Choice");
          showWelcomeMenu();
        }
      } catch (error) {
        addMessage("Invalid Choice");
        showWelcomeMenu();
      }
    } else if (currentState === "showCareers") {
      try {
        const choice = parseInt(userInput);
        if (choice > 0 && choice <= careers.length) {
          const career = careers[choice - 1];
          setCurrentState("generatingRoadmap");
          handleCareerSelection(career);
        } else if (choice === careers.length + 1) {
          addMessage("Returning to main menu...");
          setTimeout(() => showWelcomeMenu(), 500);
        } else {
          addMessage("Invalid choice. Please try again.");
          setTimeout(() => showWelcomeMenu(), 500);
        }
      } catch (error) {
        addMessage("Invalid input. Please enter a number.");
        setTimeout(() => showWelcomeMenu(), 500);
      }
    } else if (currentState === "searchCareer") {
      const searchResults = careers.filter(career =>
        career.name.toLowerCase().includes(userInput.toLowerCase())
      );
      setSelectedCareers(searchResults);

      if (searchResults.length > 0) {
        let responseText = `You searched for "${userInput}", do you mean any of the following career paths?\n\n`;
        searchResults.forEach((career, index) => {
          responseText += `${index + 1}. ${career.name}\n`;
        });
        responseText += `${
          searchResults.length + 1
        }. None of the above (Return to main menu)`;

        addMessage(responseText);
        setCurrentState("careerSelection");
        setWaitingForInput(true);
      } else {
        addMessage(
          "We could not find this career path. Please try again with a different search term."
        );
        setTimeout(() => showWelcomeMenu(), 500);
      }
    } else if (currentState === "careerSelection") {
      try {
        const choice = parseInt(userInput);
        if (choice > 0 && choice <= selectedCareers.length) {
          const career = selectedCareers[choice - 1];
          setCurrentState("generatingRoadmap");
          handleCareerSelection(career);
        } else if (choice === selectedCareers.length + 1) {
          addMessage("Returning to main menu...");
          setTimeout(() => showWelcomeMenu(), 500);
        } else {
          addMessage("Invalid choice. Please try again.");
          setTimeout(() => showWelcomeMenu(), 500);
        }
      } catch (error) {
        addMessage("Invalid input. Please enter a number.");
        setTimeout(() => showWelcomeMenu(), 500);
      }
    } else if (currentState === "openRoadmap") {
      if (
        userInput.toLowerCase() === "yes" ||
        userInput.toLowerCase() === "y"
      ) {
        addMessage("Opening roadmap file now...");
        window.open(roadmap);
        setTimeout(() => {
          addMessage("File has been opened in a new tab.");
          addMessage("Restarting Menu...");
          setTimeout(() => showWelcomeMenu(), 500);
        }, 500);
      } else {
        addMessage("Restarting Menu...");
        setTimeout(() => showWelcomeMenu(), 500);
      }
    }
  };

  const showWelcomeMenu = () => {
    setCurrentState("welcome");

    const welcomeText =
      "Welcome to SheLearns - Empowering Women in Tech!\n\n" +
      "Main Menu\n" +
      "1. Show all Career paths available on SheLearns\n" +
      "2. Get SheLearns roadmap\n" +
      "3. Exit\n\n" +
      "Enter your choice:";

    addMessage(welcomeText);
    setWaitingForInput(true);
  };

  const showAllCareers = (careers = []) => {
    let careersText = "";
    careers.forEach((career, index) => {
      careersText += `${index + 1}. ${career.name}\n`;
    });
    careersText += `${
      careers.length + 1
    }. Return to main menu\n\nSelect an option (by number):`;

    addMessage(careersText);
    setWaitingForInput(true);
  };

  const handleCareerSelection = career => {
    addMessage(
      `Creating ${articalize(career.name)} ${
        career.name
      } SheLearns roadmap for you girlie! 🤭`
    );

    axios
      .get(`${backendURL}/api/careers/${career.id}/roadmap`)
      .then(response => {
        fetch(`data:application/pdf;base64,${response.data.data}`)
          .then(res => {
            res.blob().then(blob => {
              const file = new File(
                [blob],
                `SheLearns Career Path - ${career.name}.pdf`,
                { type: "application/pdf" }
              );
              const url = URL.createObjectURL(file);
              setRoadmap(url);
              addMessage("Successfully generated your SheLearns roadmap");
              addMessage(
                "Do you want to open your roadmap file now? (yes/no):"
              );
              setCurrentState("openRoadmap");
              setWaitingForInput(true);
            });
          })
          .catch(error => {
            handleError(error);
          });
      })
      .catch(error => {
        handleError(error);
      });
  };

  useEffect(() => {
    showWelcomeMenu();

    return () => {
      URL.revokeObjectURL(roadmap);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, waitingForInput]);

  return (
    <div className="app-container">
      <div className="chat-container">
        <header className="chat-header">
          <h1>SheLearns</h1>
          <p>Empowering Women in Tech</p>
        </header>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-wrapper ${
                message.isUser ? "user-message-wrapper" : "bot-message-wrapper"
              }`}
            >
              <div
                className={`message ${
                  message.isUser ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">
                  {message.text.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={
                waitingForInput
                  ? "Type your response..."
                  : "Waiting for SheLearns..."
              }
              disabled={!waitingForInput}
              className="input-field"
            />
            <button
              type="submit"
              className={`send-button ${
                !waitingForInput || input.trim() === "" ? "disabled" : ""
              }`}
              disabled={!waitingForInput || input.trim() === ""}
            >
              <svg viewBox="0 0 24 24" fill="none" className="send-icon">
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
