import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const textToTranslate = useRef();
  const showTranslatedText = useRef();
  const copyBtn = useRef("");

  useEffect(() => {
    const fetchLanguages = () => {
      const savedData = localStorage.getItem("translatorLanguages");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setSupportedLanguages(parsedData);
        } catch (error) {
          console.error("Error parsing languages from localStorage:", error);

          localStorage.removeItem("translatorLanguages");
        }
      } else {
        const options = {
          method: "POST",
          url: "https://text-translator2.p.rapidapi.com/translate",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key":
              "fc13ba28bdmsh304539d0957d293p1a0eccjsnb335eee351ab",
            "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
          },
          data: new URLSearchParams({
            source_language: "en",
            target_language: "id",
            text: "What is your name?",
          }),
        };
        axios
          .request(options)
          .then((response) => {
            if (
              response.data &&
              response.data.data &&
              response.data.data.languages
            ) {
              setSupportedLanguages(response.data.data.languages);
              localStorage.setItem(
                "translatorLanguages",
                JSON.stringify(response.data.data.languages)
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    fetchLanguages();
  }, []);

  const translateHandler = () => {
    const text = textToTranslate.current.value;
    if (text.trim() === "") {
      alert("Please enter text to translate.");
      return;
    }

    showTranslatedText.current.innerText = "Loading...";

    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", sourceLanguage);
    encodedParams.append("target_language", targetLanguage);
    encodedParams.append("text", text);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "fc13ba28bdmsh304539d0957d293p1a0eccjsnb335eee351ab",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then((response) => {
        const translatedText = response.data.data.translatedText;
        showTranslatedText.current.innerText = translatedText;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(showTranslatedText.current.innerText);
    copyBtn.current.innerText = "Copied";
    copyBtn.current.style.backgroundColor = "green";

    setTimeout(() => {
      copyBtn.current.innerText = "Copy";
      copyBtn.current.style.backgroundColor = "#0000ff";
    }, 800);
  };

  const Select = ({ name, language, setLanguage }) => (
    <div>
      <p>{name}</p>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {supportedLanguages.map((elem, index) => (
          <option value={elem.code} key={index}>
            {elem.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div id="container">
      <header>
        <h1>Translator: English to Hindi</h1>
      </header>

      <div id="input-container">
        <input
          ref={textToTranslate}
          placeholder="Input text to translate..."
          className="text-inpt"
        />
        <button onClick={translateHandler} className="btn">
          Translate
        </button>
      </div>
      <div id="translated-data-container">
        <p ref={showTranslatedText}></p>
        <button ref={copyBtn} onClick={copyHandler} className="btn">
          Copy
        </button>
      </div>
    </div>
  );
};

export default App;
