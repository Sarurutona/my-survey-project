// server.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 2. Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Set up Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 4. Define the Endpoint where the form data will be sent
app.post('/submit-form', (req, res) => {
    // req.body contains the submitted form data
    const formData = req.body;
    console.log('Received new form submission:', formData);

    // Create a new entry with a timestamp for better tracking
    const newEntry = {
        submissionId: `sub_${Date.now()}`, // Unique ID for each submission
        submissionDate: new Date().toISOString(),
        data: formData
    };

    // Define the path to the submissions file
    const submissionsFilePath = path.join(__dirname, 'submissions.json');
    
    // 5. Read the existing data, add the new one, and save it back
    fs.readFile(submissionsFilePath, 'utf8', (err, data) => {
        let submissions = [];
        if (!err && data) {
            // If the file exists and has content, parse it
            submissions = JSON.parse(data);
        }

        // Add the new submission to the array
        submissions.push(newEntry);

        // Write the updated array back to the file
        fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving data:', writeErr);
                // Send an error response back to the form
                return res.status(500).send('Error submitting form. Please try again.');
            }
            
            // 6. Send a success response back to the form
            console.log('Submission saved successfully!');
            res.status(200).send('<h1>Thank You!</h1><p>Your form has been submitted successfully.</p><a href="javascript:history.back()">Go Back</a>');
        });
    });
});

// 7. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Waiting for form submissions...');
});