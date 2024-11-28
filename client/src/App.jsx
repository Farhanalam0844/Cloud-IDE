// import { useEffect, useState } from 'react';
// import './App.css';
// import Terminal from './components/Terminal.jsx';
// import Tree from './components/Tree.jsx';
// import socket from './socket.js';
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";
// import Editor from './components/Editor.jsx';

// function App() {
//   const [fileTree, setFileTree] = useState({});
//   const [path, setPath] = useState("/");
//   const [code, setCode] = useState("");
//   const [typingTimer, setTypingTimer] = useState(null);

//   const getFileTree = async () => {
//     const response = await fetch('http://server:8001/files');
//     const result = await response.json();
//     console.log("tree", result);
//     setFileTree(result);
//   }

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to server:', socket.id);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });
//     getFileTree();

//     return () => {
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('file:refresh');
//     };
//   }, []);

//   useEffect(() => {
//     socket.on("file:refresh", getFileTree);

//     return () => {
//       socket.off("file:refresh");
//     };
//   }, []);
//   const getFileCode = async () => {
//     console.log(path, "path")
//     const response = await fetch(`http://server:8001/files/content?path=${encodeURIComponent(path)}`);
//     const result = await response.json();
//     setCode(result.content);
//     console.log(code, result)
//     // Emit the result if needed
//     // io.emit("code:get", data);
//     // console.log("code:get emitted", data);
//   }
//   const handleFileClick = async(filePath) => {
//     console.log("handle file click ", path, filePath)
//     if (path === filePath) return;
//    await setPath(filePath);
//     getFileCode()
//     // Emit the result if needed
//     // io.emit("code:get", data);
//     // console.log("code:get emitted", data);
//     // Emit the result if needed
//     // io.emit("code:get", data);
//     // console.log("code:get emitted", data);
//   };

//   const handleEditorChange = (newCode) => {
//     setCode(newCode);

//     if (typingTimer) {
//       clearTimeout(typingTimer);
//     }

//     setTypingTimer(
//       setTimeout(() => {
//         socket.emit('code:set', { code, path });
//         console.log("code:set emitted", newCode);
//       }, 5000)
//     );
//   };

//   useEffect(() => {
//     return () => {
//       if (typingTimer) {
//         clearTimeout(typingTimer);
//       }
//     };
//   }, [typingTimer]);

//   return (
//     <>
//       <div className="main-container">
//         <div className="editor-container">
//           <div className="files">
//             {fileTree && <Tree treeData={fileTree} handleFileClick={handleFileClick} />}
//           </div>
//           <div className="editor">
//             <Editor path={path} />
//             <AceEditor
//               mode="javascript"
//               theme="github"
//               value={code}
//               name="UNIQUE_ID_OF_DIV"
//               onChange={handleEditorChange}
//               editorProps={{ $blockScrolling: true }}
//             />
//           </div>
//         </div>
//         <div className="terminal-container">
//           <Terminal />
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import Terminal from './components/Terminal.jsx';
import Tree from './components/Tree.jsx';
import socket from './socket.js';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import Editor from './components/Editor.jsx';
// import Message from './components/Message.jsx';
import MessageBox from './components/Message.jsx';

export default function App() {
  const [fileTree, setFileTree] = useState({});
  const [path, setPath] = useState("");
  const [code, setCode] = useState("");
  const [typingTimer, setTypingTimer] = useState(null);

  const getFileTree = async () => {
    const response = await fetch('http://localhost:8001/files');
    const result = await response.json();
    console.log("tree", result);
    setFileTree(result);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    getFileTree();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('file:refresh');
    };
  }, []);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);

    return () => {
      socket.off("file:refresh");
    };
  }, []);

  const getFileCode = async () => {
    
    const response = await fetch(`http://localhost:8001/files/content?path=${encodeURIComponent(path)}`);
    const result = await response.json();
    setCode(result.content);
    // console.log(code, result);
  };

  const handleFileClick = (filePath) => {
    if (path === filePath) return;
    setPath(filePath);
  };

  // Call getFileCode whenever the path changes
  useEffect(() => {
    if (path) {
      getFileCode();
    }
  }, [path]); 

  const handleEditorChange = (newCode) => {
    setCode(newCode);

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    setTypingTimer(
      setTimeout(() => {
        socket.emit('code:set', { code: newCode, path }); // Send updated code
        // console.log("code:set emitted", newCode);
      }, 2000)
    );
  };

  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [typingTimer]);

  return (
    <>
      <div className="main-container">
        <div className="editor-container">
          <div className="files">
            {fileTree && <Tree treeData={fileTree} handleFileClick={handleFileClick} />}
          </div>
          <div className="editor">
            <Editor path={path} />
            <AceEditor
              mode="javascript"
              theme="github"
              value={code}
              name="UNIQUE_ID_OF_DIV"
              onChange={handleEditorChange}
              editorProps={{ $blockScrolling: true }}
            />
          </div>
          <div className="chat">
            {/* <MessageBox /> */}
          </div>
        </div>
        <div className="terminal-container">
          <Terminal />
        </div>
      </div>
    </>
  );
}
