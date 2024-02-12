import React, { useState } from 'react';
import './App.css';

function App() {
  const [rows, setRows] = useState('');
  const [cols, setCols] = useState('');
  const [numSeq, setNumSeq] = useState(1); // Track the number of sequences
  const [sequences, setSequences] = useState(() => Array(1).fill("")); // Initialize sequences array
  const [matrix, setMatrix] = useState(() => Array.from({ length: 0 }, () => Array("").fill("")));
  const [resultMatrix, setResultMatrix] = useState([]);
  const [bufferSize, setBufferSize] = useState(1);
  const [initialMatrix, setInitialMatrix] = useState([]);
  const [scores, setScores] = useState(() => Array(1).fill(0));
  const [isResultBoxVisible, setIsResultBoxVisible] = useState(false);
  const [isSubmitButtonVisible, setSubmitButton] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [tokens, setTokens] = useState([]);
  const closeResultBox = () => setIsResultBoxVisible(false);
  const [maxSequenceSize, setMaxSequenceSize] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const handleTokenCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setTokenCount(count);
    setTokens(Array(count).fill('')); // Initialize with empty strings
  };
  const handleTokenChange = (index, value) => {
    const newTokens = tokens.map((token, i) => i === index ? value : token);
    setTokens(newTokens);
  };
  const handleSubmit = async () => {
    setIsResultBoxVisible(true);
    // Construct the payload
    const payload = {
      tokens,
      bufferSize: parseInt(bufferSize, 10),
      matrixWidth: parseInt(cols, 10),
      matrixHeight: parseInt(rows, 10),
      numSeq: parseInt(numSeq, 10),
      maxSequenceSize: parseInt(maxSequenceSize, 10)
    };
    try {
      const response = await fetch('http://localhost:5000/random', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setResultMatrix(result.result_matrix); 
      setInitialMatrix(result.initial_matrix);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGenerateMatrix = () => {
    setMatrix(Array.from({ length: rows }, () => Array(cols).fill(0)));
  };
  const handleElementChange = (r, c, value) => {
    // Ensure the value is a string and trim it to a maximum of 2 characters
    const newValue = value.toString().slice(0, 2);
    
    const newMatrix = matrix.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? newValue : cell))
    );
    setMatrix(newMatrix);
  };

  const handleCalculate = async () => {
    try {
      setIsResultBoxVisible(true);
      const response = await fetch('http://localhost:5000/multiply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include bufferSize in the body of the request
        body: JSON.stringify({ matrix, bufferSize, sequences, scores }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setResultMatrix(result.result_matrix); 
      console.log(result.result_matrix); 
      setInitialMatrix(result.initial_matrix);
    } catch (error) {
      console.error('Error during operation:', error);
    }
  };

  const handleSequenceChange = (index, value, isScore = false) => {
    if (isScore) {
      const newScores = scores.map((score, si) => si === index ? parseInt(value, 10) || 0 : score);
      setScores(newScores);
    } else {
      const newSequences = sequences.map((seq, si) => si === index ? value : seq);
      setSequences(newSequences);
    }
  };

  const handleGenerateSequences = () => {
    setSequences(Array(numSeq).fill(""));
    setScores(Array(numSeq).fill(0)); // Reset scores
  };
  const renderResultGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        console.log("Runs")
        const resultIndex = resultMatrix.findIndex(([rowIndex, colIndex]) => rowIndex === i && colIndex === j);
        const isHighlighted = resultIndex !== -1;
        row.push(
          <div
            key={`${i}-${j}`}
            className={`cell ${isHighlighted ? 'highlighted' : ''}`}
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid #f77f00',
              display: 'inline-block',
              backgroundColor: isHighlighted ? '#f77f00' : 'transparent',
              color: '#000',
              lineHeight: '50px',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            {/* Display the order number if the cell is highlighted */}
            {isHighlighted ? resultIndex + 1 : ''}
          </div>
        );
      }
      grid.push(<div key={i} className="row" style={{ display: 'flex' }}>{row}</div>);
    }
    return grid;
  };
  const renderInputMatrix = () => {
    return initialMatrix.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center">
        {row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className="cell"
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid #f77f00',
              display: 'inline-block',
              backgroundColor: 'transparent',
              color: '#f77f00',
              lineHeight: '50px',
              textAlign: 'center',
              fontSize: '16px',
              margin: '2px',
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    ));
  };
  const [activeInput, setActiveInput] = useState('manual');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json(); // Assuming the backend sends JSON response
  
      if (response.ok) {
        setCols(data.width)
        setRows(data.height)
        setInitialMatrix(data.matrix)
        setBufferSize(data.buffer_size)
        setMatrix(data.matrix)
        setSequences(data.sequences)
        setScores(data.scores)
        setSubmitButton(true)
        setUploadStatus('success');
        setUploadMessage(data.message);
        setUploadedFileName(selectedFile.name); // Display the name of the uploaded file
      } else {
        throw new Error(data.message || 'File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('failed');
      setUploadMessage("There are mistakes in file formatting");
      setUploadedFileName(''); // Reset filename on failure
    }
  };
  // Handler functions for toggling the input method
  const showManualInput = () => setActiveInput('manual');
  const showRandomInput = () => setActiveInput('random');
  const showFileInput = () => setActiveInput('file');
  return (
    <div className="App bg-black pl-[50px] h-[100%] w-[100%] pr-[30px]">
      <h1 className='text-[#f77f00] font-bold text-[52px] pt-[40px] font-serif'>Cyberpunk 2077 Hacking Minigame Solver</h1>
      <h2 className='text-[#f77f00] font-semibold text-[22px] font-serif pb-[30px]'>INSTANT BREACH PROTOCOL SOLVER - START CRACKING, SAMURAI</h2>
      <div className="input-toggle-buttons flex gap-[40px]">
        <button onClick={showManualInput} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>Manual Input</button>
        <button onClick={showRandomInput} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>Random Input</button>
        <button onClick={showFileInput} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>File Input</button>
      </div>
      {activeInput === 'manual' && (
        <div className="Manual-Input-Page">
        <div className="Size flex gap-[30px]">
          <div className='py-[50px] border-[3px] border-[#f77f00] w-[1000px] px-[30px] mt-[30px]'>
            <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Rows:</label>
            <input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value, 10))} min="1" className='mr-[30px]'/>
            <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Columns:</label>
            <input type="number" value={cols} onChange={(e) => setCols(parseInt(e.target.value, 10))} min="1" className='mr-[30px]'/>
            <button onClick={handleGenerateMatrix} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>Generate Matrix</button>
          </div>
          <div className="border-[3px] border-[#f77f00] py-[60px] px-[30px] mt-[30px]">
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Buffer:</label>
            <input 
              type="number" 
              value={bufferSize} 
              onChange={(e) => setBufferSize(parseInt(e.target.value, 10))} 
              min="1" 
              className='mr-[30px]'/>
          </div>
        </div>
        <div className='py-[30px]'>
          {matrix.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((cell, c) => (
                <input
                  key={c}
                  type="text" 
                  value={cell}
                  maxLength="2" 
                  onChange={(e) => handleElementChange(r, c, e.target.value)}
                  className='w-[100px] bg-[#f77f00] h-[100px] border-[8px] border-black text-center'
                />
              ))}
            </div>
          ))}
        </div>
        <div className='SequenceForm py-[50px] border-[3px] border-[#f77f00] w-[1000px] px-[30px]'>
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Number of Sequences:</label>
          <input type="number" value={numSeq} onChange={(e) => setNumSeq(parseInt(e.target.value, 10))} min="1" className='mr-[30px]'/>
          <button onClick={handleGenerateSequences} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>Generate Sequences</button>
        </div>
        
        <div className="SequenceBox pt-[25px]">
          {sequences.map((seq, index) => (
            <div key={index} className='py-[10px]'>
              <input
                type="text"
                value={seq}
                onChange={(e) => handleSequenceChange(index, e.target.value)}
                className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center'
              />
              <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px] ml-[40px]'>Score:</label>
              <input
                type="number"
                value={scores[index]}
                onChange={(e) => handleSequenceChange(index, e.target.value, true)}
                className='Score w-[150px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center'
              />
            </div>
          ))}
        </div>
        <button onClick={handleCalculate} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl mt-[20px] mb-[50px]'>Find Solution</button>
          </div>
      )}

      {activeInput === 'random' && (
      <div className="Random-Input-Page">
      <div className="Container flex">
        <div className='my-[30px] w-[50%] '>
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Number of Tokens:</label>
          <input type="number" value={tokenCount} onChange={handleTokenCountChange} className='w-[200px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center my-[20px]'/>
          {tokens.map((token, index) => (
            <input key={index} type="text" value={token} onChange={(e) => handleTokenChange(index, e.target.value)} placeholder={`Token ${index + 1}`} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center block' />
          ))}
        </div>
        <div className='flex flex-col'>
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Buffer Size:</label>
          <input type="number" value={bufferSize} onChange={(e) => setBufferSize(e.target.value)} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center' />
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Matrix Width:</label>
          <input type="number" value={cols} onChange={(e) => setCols(e.target.value)} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center' />
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Matrix Height:</label>
          <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center' />
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Number of Sequences:</label>
          <input type="number" value={numSeq} onChange={(e) => setNumSeq(e.target.value)} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center' />
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'l>Max Sequence Size:</label>
          <input type="number" value={maxSequenceSize} onChange={(e) => setMaxSequenceSize(e.target.value)} className='w-[500px] bg-[#f77f00] h-[40px] border-[3px] border-black text-center' />
        </div>
        </div>
        <button onClick={handleSubmit} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl mt-[20px] mb-[60px]'>Generate</button>
        </div>
      )}
      {activeInput === 'file' && (
        <div className="File-Input-Page h-[100vh]">
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px] py-[30px]'>Please input only a .txt file:</label>
          <input 
            type="file" 
            accept=".txt"
            onChange={handleFileChange}
            className='my-[30px]' 
          />
        <div className="upload-status">
          {uploadStatus === 'success' && (
            <div>
              <p style={{ color: 'green' }}>{uploadMessage}</p>
              <p style={{ color: 'green' }}>File Uploaded: {uploadedFileName}</p>
            </div>
          )}
          {uploadStatus === 'failed' && (
            <p style={{ color: 'red' }}>{uploadMessage}</p>
          )}
        </div>
        <div className="Button">
        <button onClick={handleFileUpload} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] py-[10px] rounded-xl  my-[30px]  px-[30px] mr-[80px] '>
            Upload File
          </button>
          {isSubmitButtonVisible &&(
        <button onClick={handleCalculate} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl mt-[20px] mb-[50px]'>Find Solution</button>
      )
      }
      </div>
        </div>

      )}

      {isResultBoxVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeResultBox}>
          <div className="bg-black border-4 border-[#f77f00] p-5 w-3/4 max-h-[80%] overflow-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-[#f77f00] mb-4">Initial Input Matrix:</h3>
            {renderInputMatrix()}
            <h3 className="text-[#f77f00] mt-4 mb-4">Sequences and Scores:</h3>
            <ul>
              {sequences.map((sequence, index) => (
                <li key={index} className="text-[#f77f00]">
                  Sequence {index + 1}: {sequence} - Score: {scores[index]}
                </li>
              ))}
            </ul>
            {resultMatrix.length > 0 ? (
              <div>
                <h3 className="text-[#f77f00] mt-4 mb-4">Result Matrix:</h3>
                {renderResultGrid()}
              </div>
            ) : (
              <h3 className="text-[#f77f00] mt-4 mb-4">No Solution Found</h3>
            )}
            <button className="mt-4 px-4 py-2 bg-[#370617] text-[#f77f00] rounded hover:bg-[#f77f00] hover:text-black transition" onClick={closeResultBox}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
