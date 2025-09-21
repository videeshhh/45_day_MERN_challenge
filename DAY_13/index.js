const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


const workExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name too long']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position title too long']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  technologies: [{ type: String, trim: true }],
  achievements: [{ type: String, trim: true }]
}, { timestamps: true });

const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);

const validateWorkExperience = (req, res, next) => {
  const errors = [];
  if (!req.body.company?.trim()) {
    errors.push('Company name is required');
  }
  if (!req.body.position?.trim()) {
    errors.push('Position is required');
  }
  if (!req.body.startDate) {
    errors.push('Start date is required');
  }
  if (
    req.body.endDate &&
    req.body.startDate &&
    new Date(req.body.endDate) < new Date(req.body.startDate)
  ) {
    errors.push('End date must be after start date');
  }
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};


app.post('/api/work-experience', validateWorkExperience, async (req, res) => {
  try {
    const newExperience = new WorkExperience(req.body);
    const savedExperience = await newExperience.save();
    res.status(201).json({ success: true, data: savedExperience });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/work-experience', async (req, res) => {
  try {
    const filter = {};
    if (req.query.current) {
      filter.current = req.query.current === 'true';
    }
    const experiences = await WorkExperience.find(filter);
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/work-experience/:id', async (req, res) => {
  try {
    const experience = await WorkExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/work-experience/:id', validateWorkExperience, async (req, res) => {
  try {
    const updatedExperience = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: updatedExperience });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/work-experience/:id', validateWorkExperience, async (req, res) => {
  try {
    const updatedExperience = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: updatedExperience });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/work-experience/:id', async (req, res) => {
  try {
    const deleted = await WorkExperience.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
