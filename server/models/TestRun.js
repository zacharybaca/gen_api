import mongoose from 'mongoose';

const testRunSchema = new mongoose.Schema(
  {
    sequenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestSequence',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pass', 'Fail', 'Pending'],
      default: 'Pending',
    },
    executionTimeMs: {
      type: Number,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    actualResponsePayload: {
      type: mongoose.Schema.Types.Mixed,
    }
  },
  {
    timestamps: true,
  }
);

const TestRun = mongoose.model('TestRun', testRunSchema);
export default TestRun;
