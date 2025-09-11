const express = require('express');
const app = express();

const projects = [
{ id: 1, title: 'E-Commerce Platform', technologies: ['React', 'Node.js'] },
{ id: 2, title: 'Task Management App', technologies: ['Vue.js', 'Express'] },
{ id: 3, title: 'Bus tracking app', technologies: ['Node.js', 'Express'] }
];
const workExperience = [
{ id: 1, company: 'Tech Corp', position: 'Full Stack Developer' },
{ id: 1, company: 'Google', position: 'Cyber Security analyst' }
];

app.get('/api/projects', (req, res) => {
res.json({ success: true, count: projects.length, data: projects });
});

app.get('/api/exp', (req, res) => {
res.json({ success: true, count: workExperience.length, data: workExperience });
});

app.get('/api/projects/:id', (req, res) => {
const projectId = parseInt(req.params.id);
const project = projects.find(p => p.id === projectId);
if (!project) {
return res.status(404).json({
success: false,
error: 'Project not found'
});
}
res.json({ success: true, data: project });
});

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
});