
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const mongoDBURI = process.env.MONGODB_URI;


const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Legal Aid Provider Schema
const Schema = mongoose.Schema;

const legalAidProviderSchema = new Schema({
    lawyerId: { type: String, required: true, unique: true },
    personalInfo: {
        name: { type: String, required: true },
        firmName: { type: String },
        contactInfo: {
            phone: { type: String },
            email: { type: String }
        },
        address: { type: String, required: true }
    },
    submittedApplications: [{
        prisonerId: { type: Schema.Types.ObjectId, ref: 'UndertrialPrisoner' },
        bailId: { type: Schema.Types.ObjectId, ref: 'BailApplication' }, // Reference to Bail Application
        applicationDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    }],
    documents: {
        powerOfAttorney: { type: String },
        caseFiles: [{ type: String }],
        supportingAffidavits: [{ type: String }]
    },
}, { timestamps: true });

const LegalAidProvider = mongoose.model('LegalAidProvider', legalAidProviderSchema);

// API Routes

// 1. Create a new Legal Aid Provider
app.post('/api/newlegal-aid-providers', async (req, res) => {
    try {
        const newProvider = new LegalAidProvider(req.body);
        const savedProvider = await newProvider.save();
        res.status(201).json(savedProvider);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. Retrieve all Legal Aid Providers
app.get('/api/legal-aid-providers', async (req, res) => {
    try {
        const providers = await LegalAidProvider.find();
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Retrieve a single Legal Aid Provider by ID
app.get('/api/legal-aid-providers/:id', async (req, res) => {
    try {
        const provider = await LegalAidProvider.findById(req.params.id);
        if (provider) {
            res.json(provider);
        } else {
            res.status(404).json({ message: 'Legal Aid Provider not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Update a Legal Aid Provider
app.put('/api/legal-aid-providers/:id', async (req, res) => {
    try {
        const updatedProvider = await LegalAidProvider.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedProvider) {
            res.json(updatedProvider);
        } else {
            res.status(404).json({ message: 'Legal Aid Provider not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. Delete a Legal Aid Provider
app.delete('/api/legal-aid-providers/:id', async (req, res) => {
    try {
        const deletedProvider = await LegalAidProvider.findByIdAndDelete(req.params.id);
        if (deletedProvider) {
            res.json({ message: 'Legal Aid Provider deleted' });
        } else {
            res.status(404).json({ message: 'Legal Aid Provider not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Submit a Bail Application for a Legal Aid Provider
app.post('/api/legal-aid-providers/:id/applications', async (req, res) => {
    try {
        const provider = await LegalAidProvider.findById(req.params.id);
        if (provider) {
            const newApplication = {
                prisonerId: req.body.prisonerId,
                bailId: req.body.bailId,
                applicationDate: req.body.applicationDate,
                status: req.body.status || 'Pending'
            };
            provider.submittedApplications.push(newApplication);
            const updatedProvider = await provider.save();
            res.json(updatedProvider);
        } else {
            res.status(404).json({ message: 'Legal Aid Provider not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
