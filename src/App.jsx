// import { useEffect, useState } from "react";
// import * as webllm from "@mlc-ai/web-llm";

// import "./App.css";
// import "./app.scss";

// function App() {
//   const [messages, setMessages] = useState([
//     {
//       role: "system",
//       content: "hello, how can i help you?",
//     },
//   ]);

//   const [engine, setEngine] = useState(null);
//   const [input, setInput] = useState("");

//   // Load Llama Model
//   useEffect(() => {
//     const selectedModel = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

//     webllm
//       .CreateMLCEngine(selectedModel, {
//         initProgressCallback: (progress) => {
//           console.log(progress);
//         },
//       })
//       .then((eng) => {
//         setEngine(eng);
//       });
//   }, []);

//   // Send message function
//   async function sendMessageToLlm() {
//     if (!engine) return;

//     const tempMessages = [...messages];

//     // Add user message
//     tempMessages.push({
//       role: "user",
//       content: input,
//     });

//     setMessages(tempMessages);
//     setInput("");

//     // Generate reply from LLM
//     const reply = await engine.chat.completions.create({
//       messages: tempMessages,
//     });

//     console.log(reply.choices[0].message.content);

//     // MLC returns reply in `text`
//     const text = reply.choices[0].message.content;

//     // Add assistant reply
//     tempMessages.push({ role: "assistant", content: text });

//     setMessages([...tempMessages]);
//   }

//   return (
//     <>
//       <main>
//         <section>
//           <div className="converstion-area">
//             <div className="messages">
//               {messages
//                 .filter((message) => message.role !== "system")
//                 .map((message, index) => {
//                   return (
//                     <div key={index} className={`message ${message.role}`}>
//                       {message.content}
//                     </div>
//                   );
//                 })}
//             </div>

//             <div className="input-area">
//               <input
//                 onChange={(e) => setInput(e.target.value)}
//                 value={input}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") sendMessageToLlm();
//                 }}
//                 type="text"
//                 placeholder="message for llm"
//               />
//               <button onClick={sendMessageToLlm}>send</button>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";

import "./App.css";
import "./app.scss";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "hello, how can i help you?",
    },
  ]);

  const [engine, setEngine] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);     // ⬅ loading state
  const [loadText, setLoadText] = useState("");     // ⬅ progress text

  // Load model
  useEffect(() => {
    const selectedModel = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

    webllm
      .CreateMLCEngine(selectedModel, {
        initProgressCallback: (progress) => {
          console.log(progress);
          setLoadText(progress.text); // Update loading progress text
        },
      })
      .then((eng) => {
        setEngine(eng);
        setLoading(false); // ⬅ MARK MODEL AS READY
      });
  }, []);

  // Send message function
  async function sendMessageToLlm() {
    if (!engine) return;

    const tempMessages = [...messages];

    tempMessages.push({
      role: "user",
      content: input,
    });

    setMessages(tempMessages);
    setInput("");

    const reply = await engine.chat.completions.create({
      messages: tempMessages,
    });

    console.log(reply.choices[0]);

    // Correct way to access answer in WebLLM
    const text = reply.choices[0].message.content;

    tempMessages.push({ role: "assistant", content: text });

    setMessages([...tempMessages]);
  }

  // ========== UI ==========
  return (
    <>
      <main>
        <section>
          {/* LOADING SCREEN */}
          {loading && (
            <div className="loading-screen">
              <h2>Loading AI Model...</h2>
              <p>{loadText}</p>
              <div className="spinner"></div>
            </div>
          )}

          {/* CHAT UI - Only show after model loaded */}
          {!loading && (
            <div className="converstion-area">
              <div className="messages">
                {messages
                  .filter((m) => m.role !== "system")
                  .map((m, i) => (
                    <div key={i} className={`message ${m.role}`}>
                      {m.content}
                    </div>
                  ))}
              </div>

              <div className="input-area">
                <input
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessageToLlm();
                  }}
                  type="text"
                  placeholder="message for llm"
                />
                <button onClick={sendMessageToLlm}>send</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
