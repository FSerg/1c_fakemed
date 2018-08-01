import mongoose from 'mongoose';

const { Schema } = mongoose;
const docSchema = new Schema({
  name: { type: String, index: true },
  packaging: { type: String, index: true },
  series: { type: String, index: true },
  producer: { type: String, index: true },
  country: String,
  status: String,
  type: String,
  scope: String,
  letter: String,
  link: String,
  updated_drugstores: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FakeMed', docSchema);
