
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const mongoDBURI = process.env.MONGODB_URI;


const app = express();


app.use(bodyParser.json());


mongoose.connect(mongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});


const Schema = mongoose.Schema;

const prisonAuthoritySchema = new Schema(
  {
    authorityId: { type: String, required: true, unique: true },
    prisonName: { type: String, required: true },
    contactInfo: {
      phone:{ type: String },
      email: { type: String },
    },
    prisonerData: [
      {
        prisonerId: { type: Schema.Types.ObjectId, ref: 'UndertrialPrisoner',unique: true  },
        incarcerationReport: { type: String },
        behaviorReports: [{ type: String }],
        medicalRecords: [{ type: String }],
        disciplinaryRecords: [{ type: String }],
      },
    ],
    releaseAuthorizations: [
      {
        prisonerId: { type: Schema.Types.ObjectId, ref: 'UndertrialPrisoner',unique: true  },
        releaseDate: { type: Date },
        conditions: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

const PrisonAuthority = mongoose.model('PrisonAuthority', prisonAuthoritySchema);

// API Routes

// Get all prison authorities
app.get('/api/allprisons', async (req, res) => {
  try {
    const prisonAuthorities = await PrisonAuthority.find();
    res.json(prisonAuthorities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific prison authority by ID
app.get('/api/prison/:id', async (req, res) => {
  try {
    const prisonAuthority = await PrisonAuthority.findById(req.params.id);
    if (!prisonAuthority) {
      return res.status(404).json({ message: 'Prison authority not found' });
    }
    res.json(prisonAuthority);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new prison authority
app.post('/api/newprison', async (req, res) => {
  const { authorityId, prisonName, contactInfo, prisonerData, releaseAuthorizations } = req.body;

  try {
    const newPrisonAuthority = new PrisonAuthority({
      authorityId,
      prisonName,
      contactInfo,
      prisonerData,
      releaseAuthorizations,
    });

    const savedPrisonAuthority = await newPrisonAuthority.save();
    res.status(201).json(savedPrisonAuthority);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a prison authority
app.put('/api/updateprison/:id', async (req, res) => {
  try {
    const updatedPrisonAuthority = await PrisonAuthority.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPrisonAuthority) {
      return res.status(404).json({ message: 'Prison authority not found' });
    }
    res.json(updatedPrisonAuthority);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a prison authority
app.delete('/api/deleteprison/:id', async (req, res) => {
  try {
    const deletedPrisonAuthority = await PrisonAuthority.findByIdAndDelete(req.params.id);
    if (!deletedPrisonAuthority) {
      return res.status(404).json({ message: 'Prison authority not found' });
    }
    res.json({ message: 'Prison authority deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
