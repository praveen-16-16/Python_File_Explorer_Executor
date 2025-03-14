const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const { spawn } = require("child_process");


const app = express();

app.use(cors());
app.use(express.json());

const PYTHON_FOLDER = path.join(__dirname, "pythonfolder");

app.get("/files", (req, res) => {
    const getfile = (dir) => {
        
        
        return fs.readdirSync(dir).map((file) => {
            const fullpath = path.join(dir, file)
            return fs.statSync(fullpath).isDirectory() ?
                { name: file, children: getfile(fullpath) } :
                { name: file }
        })

    }
    res.json(getfile(PYTHON_FOLDER))
})



app.post("/run_python", (req, res) => {
    try {
        const { file } = req.body;
        console.log("Received request to run:", file);

        if (!file) {
            return res.status(400).json({ message: "No file specified" });
        }

        const file_path = path.join(PYTHON_FOLDER, file);

        if (!fs.existsSync(file_path)) {
            return res.status(400).json({ message: "File not found" });
        }

        const process = spawn("python", [file_path]);

        let output = "";
        let error = "";

        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            error += data.toString();
        });

        process.on("close", (code) => {
            console.log(`Process exited with code: ${code}`);
            if (error) {
                return res.json({ error });
            }
            res.json({ output: output || "No output from script" });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("The Server is Running on Port 3000");
})