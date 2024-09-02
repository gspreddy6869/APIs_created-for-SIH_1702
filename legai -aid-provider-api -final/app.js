const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'legal_documents', 
    allowed_formats: ['jpeg', 'png', 'pdf', 'docx'], 
  },
});

const upload = multer({ storage: storage });

const mongoDBURI = process.env.MONGODB_URI;
const app = express();


app.use(bodyParser.json());


mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


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
    bailId: { type: Schema.Types.ObjectId, ref: 'BailApplication' }, 
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
app.get('/api/alllegal-aid-providers', async (req, res) => {
  try {
    const providers = await LegalAidProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Retrieve a single Legal Aid Provider by ID
app.get('/api/legal-aid-providersbyid/:id', async (req, res) => {
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
app.put('/api/updatelegal-aid-providers/:id', async (req, res) => {
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
app.delete('/api/deletelegal-aid-providers/:id', async (req, res) => {
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

// 6. Submit a Bail Application 
app.post('/api/bail-application/:id', async (req, res) => {
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

// 7. Upload Documents
app.post('/api/documents/:id/', upload.fields([
  { name: 'powerOfAttorney', maxCount: 1 },
  { name: 'caseFiles', maxCount: 10 },
  { name: 'supportingAffidavits', maxCount: 10 }
]), async (req, res) => {
  try {
    const provider = await LegalAidProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Legal Aid Provider not found' });
    }

    if (req.files.powerOfAttorney) {
      provider.documents.powerOfAttorney = req.files.powerOfAttorney[0].path;
    }

    if (req.files.caseFiles) {
      provider.documents.caseFiles = req.files.caseFiles.map(file => file.path);
    }

    if (req.files.supportingAffidavits) {
      provider.documents.supportingAffidavits = req.files.supportingAffidavits.map(file => file.path);
    }

    const updatedProvider = await provider.save();
    res.json(updatedProvider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
