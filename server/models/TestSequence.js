import mongoose from 'mongoose';

const testSequenceSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    endpoint: {
      type: String,
      required: [true, 'Endpoint path is required (e.g., /api/blogposts)'],
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    requestPayload: {
      type: mongoose.Schema.Types.Mixed, // Allows flexible JSON structures
      default: {},
    },
    expectedStatus: {
      type: Number,
      required: true,
      default: 200,
    },
    expectedResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }
  },
  {
    timestamps: true,
  }
);

const TestSequence = mongoose.model('TestSequence', testSequenceSchema);
export default TestSequence;
