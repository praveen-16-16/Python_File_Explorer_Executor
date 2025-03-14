import { useEffect, useState } from 'react'

import './App.css'

function App() {
  const [files, setfiles] = useState([]);
  const [output, setoutput] = useState("")

  const API = "http://localhost:3000"
  useEffect(() => {
    const getfile = async () => {
      const response = await fetch(`${API}/files`)
      const data = await response.json()
      setfiles(data)
    }
    getfile()
  }, [])

  const Getresult = async (file) => {
    const response = await fetch(`${API}/run_python`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file })
    })
    const data = await response.json()
    console.log(data);
    
    setoutput(data.output || data.error)

  }
  const show_file = (files) => {
    return files.map((file) => (
      <div>
        {file.children ? (
          <>
            <p>📁{file.name}</p>
            {show_file(file.children)}
          </>
        ) : (
          <div className='file' onClick={() => Getresult(file.name)}>
            📜{file.name}
          </div>
        )}
      </div>
    ))
  }
  return (
    <>
      <div className='container'>
        <div className='container_folder'>
        <h3>FOLDER STRUCTURE</h3>
        {show_file(files)}
        </div>

        <div className='output'>
          <h3> 💻OUTPUT</h3>
          <pre> {output}</pre>
        </div>
      </div>
    </>
  )
}

export default App
