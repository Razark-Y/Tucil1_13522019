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
  const [scores, setScores] = useState(() => Array(1).fill(0));
  const [isResultBoxVisible, setIsResultBoxVisible] = useState(false);
  const closeResultBox = () => setIsResultBoxVisible(false);
  const [showManualInput, setShowManualInput] = useState(true);
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
      console.log(result); // Log the response to show it was successful
      setResultMatrix(result.result_matrix); // Adjust according to how you want to use the result
    } catch (error) {
      console.error('Error during operation:', error);
    }
  };

  const handleSequenceChange = (index, value, isScore = false) => {
    if (isScore) {
      // Update the score for the sequence
      const newScores = scores.map((score, si) => si === index ? parseInt(value, 10) || 0 : score);
      setScores(newScores);
    } else {
      // Update the sequence value
      const newSequences = sequences.map((seq, si) => si === index ? value : seq);
      setSequences(newSequences);
    }
  };

  // Function to generate the specified number of sequence inputs
  const handleGenerateSequences = () => {
    setSequences(Array(numSeq).fill(""));
    setScores(Array(numSeq).fill(0)); // Reset scores
  };
  const renderResultGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        // Find the index of the current cell in the resultMatrix
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
    return matrix.map((row, rowIndex) => (
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
  const toggleRandomInput = () => {
    setShowManualInput(!showManualInput);
  };
  return (
    <div className="App bg-black pl-[50px] h-[100%] w-[100%] pr-[30px]">
      <h1 className='text-[#f77f00] font-bold text-[52px] pt-[40px] font-serif'>Cyberpunk 2077 Hacking Minigame Solver</h1>
      <h2 className='text-[#f77f00] font-semibold text-[22px] font-serif pb-[30px]'>INSTANT BREACH PROTOCOL SOLVER - START CRACKING, SAMURAI</h2>
      <button onClick={toggleRandomInput} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl mb-[30px]'>Toggle Random Input</button>
    <div className="Manual-Input-Page">
      <div className="Size flex gap-[30px]">
        <div className='py-[50px] border-[3px] border-[#f77f00] w-[1000px] px-[30px]'>
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Rows:</label>
          <input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value, 10))} min="1" className='mr-[30px]'/>
          <label className='text-[#f77f00] font-semibold text-[22px] font-serif pr-[30px]'>Columns:</label>
          <input type="number" value={cols} onChange={(e) => setCols(parseInt(e.target.value, 10))} min="1" className='mr-[30px]'/>
          <button onClick={handleGenerateMatrix} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl'>Generate Matrix</button>
        </div>
        <div className="border-[3px] border-[#f77f00] py-[60px] px-[30px]">
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
      <button onClick={handleCalculate} className='text-[#f77f00] font-semibold text-[22px] font-serif bg-[#370617] px-[20px] py-[10px] rounded-xl mt-[20px]'>Find Solution</button>
      </div>
      /Batas
      {isResultBoxVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeResultBox}>
        <div className="bg-black border-4 border-[#f77f00] p-5 w-3/4 max-h-[80%] overflow-auto" onClick={e => e.stopPropagation()}>
          <h3 className="text-[#f77f00] mb-4">Initial Input Matrix:</h3>
          {renderInputMatrix()}
          <h3 className="text-[#f77f00] mt-4 mb-4">Result Matrix:</h3>
          {renderResultGrid()}
          <button className="mt-4 px-4 py-2 bg-[#370617] text-[#f77f00] rounded hover:bg-[#f77f00] hover:text-black transition" onClick={closeResultBox}>Close</button>
        </div>
      </div>
    )}
    </div>
  );
}

export default App;
