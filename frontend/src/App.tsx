import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8001/")
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setMessage(data.Hello);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div className="App">
      <h1>Message from Backend:</h1>
      <p>{message}</p>{" "}
    </div>
  );
}

export default App;
