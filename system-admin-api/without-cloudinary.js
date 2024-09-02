const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); 


const app = express();
const PORT = 3000;


const mongoDBURI = process.env.MONGODB_URI;


app.use(bodyParser.json());


mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define the SystemAdmin schema
const systemAdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  personalInfo: {
    name: { type: String, required: true },
    contactInfo: {
      phone: { type: String },
      email: { type: String }
    }
  },
  tasks: [{
    taskType: { type: String, enum: ['Database', 'Security', 'UI/UX', 'Support'], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
  }],
  systemDocuments: {
    architectureDocs: [{ type: String }],
    securityAuditReports: [{ type: String }]
  },
  technicalIssues: [{
    issueDescription: { type: String, required: true },
    reportDate: { type: Date, default: Date.now },
    resolutionStatus: { type: String, enum: ['Unresolved', 'Resolved'], default: 'Unresolved' }
  }]
}, { timestamps: true });

// Create the SystemAdmin model
const SystemAdmin = mongoose.model('SystemAdmin', systemAdminSchema);

// CRUD Routes for SystemAdmin

// Create a new SystemAdmin
app.post('/newsystem-admin', async (req, res) => {
  try {
    const newAdmin = new SystemAdmin(req.body);
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all SystemAdmins
app.get('/allsystem-admins', async (req, res) => {
  try {
    const admins = await SystemAdmin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific SystemAdmin by ID
app.get('/system-adminsbyid/:id', async (req, res) => {
  try {
    const admin = await SystemAdmin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a SystemAdmin by ID
app.put('/Updatesystem-admins/:id', async (req, res) => {
  try {
    const updatedAdmin = await SystemAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a SystemAdmin by ID
app.delete('/deletesystem-admins/:id', async (req, res) => {
  try {
    const deletedAdmin = await SystemAdmin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
