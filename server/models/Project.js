import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
