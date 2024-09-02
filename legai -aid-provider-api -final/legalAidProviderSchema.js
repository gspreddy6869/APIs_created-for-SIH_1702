const mongoose = require('mongoose');
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
    applicationDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    bailId: { type: Schema.Types.ObjectId, ref: 'Bail' } // Added bailId field
  }],
  documents: {
    powerOfAttorney: { type: String },
    caseFiles: [{ type: String }],
    supportingAffidavits: [{ type: String }]
  },
}, { timestamps: true });

module.exports = mongoose.model('LegalAidProvider', legalAidProviderSchema);
