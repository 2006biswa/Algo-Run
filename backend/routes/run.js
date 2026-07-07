const express = require('express');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const authMiddleware = require('../middleware/auth');
const Submission = require('../models/Submission');

const router = express.Router();

const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

router.post('/run', authMiddleware, async (req, res) => {
    const { code, input } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code cannot be empty' });
    }

    const uniqueId = randomUUID();
    const filePath = path.join(tempDir, `${uniqueId}.cpp`);
    const outPath = path.join(tempDir, `${uniqueId}.exe`); // On Windows, g++ produces .exe. If Linux, it would be just ${uniqueId}.
    const inputPath = path.join(tempDir, `${uniqueId}.txt`);

    // 1. Write the code and optional input to temporary files
    fs.writeFileSync(filePath, code);
    if (input !== undefined && input !== null) {
        fs.writeFileSync(inputPath, input);
    }

    // 2. Compile and execute
    const compileCommand = `g++ ${filePath} -o ${outPath}`;
    
    exec(compileCommand, (error, stdout, stderr) => {
        if (error) {
            // Compilation error
            fs.unlinkSync(filePath);
            saveSubmission(req.user, code, stderr, 'Error');
            return res.json({ output: stderr, status: 'Error' });
        }

        // 3. Execute the binary with a timeout (TLE prevention)
        // If input exists, pipe it into the executable
        const runCommand = (input !== undefined && input !== null) 
            ? `"${outPath}" < "${inputPath}"` 
            : `"${outPath}"`;
            
        const child = exec(runCommand, { timeout: 3000 }, (runError, runStdout, runStderr) => {
            // Clean up files
            try { fs.unlinkSync(filePath); } catch (e) {}
            try { fs.unlinkSync(outPath); } catch (e) {}
            try { fs.unlinkSync(inputPath); } catch (e) {}

            let finalOutput = runStdout;
            let finalStatus = 'Success';

            if (runError) {
                if (runError.killed) {
                    finalOutput = 'Time Limit Exceeded';
                    finalStatus = 'Time Limit Exceeded';
                } else {
                    finalOutput = runStderr || runError.message;
                    finalStatus = 'Error';
                }
            }

            saveSubmission(req.user, code, finalOutput, finalStatus);
            res.json({ output: finalOutput, status: finalStatus });
        });
    });
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

async function saveSubmission(userId, code, output, status) {
    try {
        await Submission.create({ userId, code, output, status });
    } catch (err) {
        console.error("Error saving submission:", err);
    }
}

module.exports = router;
