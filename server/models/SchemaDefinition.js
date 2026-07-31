import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Mixed'] // Based on your valid field types
  },
  required: { type: Boolean, default: false }
});

const schemaDefinitionSchema = new mongoose.Schema(
  {
    entityName: {
      type: String,
      required: [true, 'Entity name is required (e.g., BlogPost)'],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    fields: [fieldSchema],
    options: {
      scaffoldRoutes: { type: Boolean, default: true },
      scaffoldControllers: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
  }
);

const SchemaDefinition = mongoose.model('SchemaDefinition', schemaDefinitionSchema);
export default SchemaDefinition;
