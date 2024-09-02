const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT||3000;

app.use(bodyParser.json());
const mongoDBURI = process.env.MONGODB_URI;


// Define the JudicialAuthority schema and model
const Schema = mongoose.Schema;

const judicialAuthoritySchema = new Schema({
    judgeId: { type: String, required: true, unique: true },
    personalInfo: {
        name: { type: String, required: true },
        courtName: { type: String, required: true },
        contactInfo: {
            phone: { type: String },
            email: { type: String }
        },
    },
    bailApplications: [{
        bailId: { type: Schema.Types.ObjectId, ref: 'BailApplication' },
        evaluation: { type: String },
        riskFactors: [{ type: String }],
        decision: {
            result: { type: String, enum: ['Approved', 'Rejected'], default: 'Pending' },
            date: { type: Date }
        },
        conditions: [{ type: String }],
    }],
    documents: {
        courtProceedings: [{ type: String }],
        riskAssessmentReports: [{ type: String }],
        legalOpinions: [{ type: String }],
    },
}, { timestamps: true });

const JudicialAuthority = mongoose.model('JudicialAuthority', judicialAuthoritySchema);


mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.post('/api/newjudicial-authorities', async (req, res) => {
    try {
        const newAuthority = new JudicialAuthority(req.body);
        const savedAuthority = await newAuthority.save();
        res.status(201).json(savedAuthority);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all JudicialAuthorities
app.get('/api/alljudicial-authorities', async (req, res) => {
    try {
        const authorities = await JudicialAuthority.find();
        res.status(200).json(authorities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a JudicialAuthority by ID
app.get('/api/judicial-authorities/:id', async (req, res) => {
    try {
        const authority = await JudicialAuthority.findById(req.params.id);
        if (!authority) return res.status(404).json({ message: 'Judicial Authority not found' });
        res.status(200).json(authority);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a JudicialAuthority by ID
app.put('/api/updatejudicial-authorities/:id', async (req, res) => {
    try {
        const updatedAuthority = await JudicialAuthority.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAuthority) return res.status(404).json({ message: 'Judicial Authority not found' });
        res.status(200).json(updatedAuthority);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a JudicialAuthority by ID
app.delete('/api/deletejudicial-authorities/:id', async (req, res) => {
    try {
        const deletedAuthority = await JudicialAuthority.findByIdAndDelete(req.params.id);
        if (!deletedAuthority) return res.status(404).json({ message: 'Judicial Authority not found' });
        res.status(200).json({ message: 'Judicial Authority deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
