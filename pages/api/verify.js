console.log('API /api/verify called');
const formidable = require('formidable');
const fs = require('fs');
const { spawn } = require('child_process');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const os = require('os');
  const path = require('path');
  const uploadDir = path.join(os.tmpdir(), 'dfi-uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir; // Save files in temp uploads dir
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    console.log('Formidable fields:', fields);
    console.log('Formidable files:', files);
    if (err) {
      res.status(500).json({ error: 'Error parsing form data', details: err.message });
      return;
    }
    // Support formidable v3+ (files are arrays)
    const documentFile = Array.isArray(files.document) ? files.document[0] : files.document;
    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
    const documentPath = documentFile?.filepath || documentFile?.path;
    const videoPath = videoFile?.filepath || videoFile?.path;
    const fullName = fields.fullName || fields.full_name || '';
    if (!documentPath || !videoPath || !fullName) {
      console.error('Missing file(s) or fullName:', { documentPath, videoPath, fullName });
      res.status(400).json({ error: 'Missing document, video file, or full name.' });
      return;
    }
    function sendProgress(progress) {
      res.write(JSON.stringify({ progress }) + '\n');
    }
    const py = spawn('python', ['ai_identity_verification.py', documentPath, videoPath, fullName]);
    let output = '';
    let errorOutput = '';
    let progress = 0;
    py.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('[PYTHON]', text.trim());
      // Parse progress from Python output (look for 'PROGRESS:x')
      const progressRegex = /PROGRESS:(\d+)/g;
      let match;
      while ((match = progressRegex.exec(text)) !== null) {
        progress = parseInt(match[1], 10);
        sendProgress(progress);
      }
    });
    py.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error('[PYTHON ERROR]', text.trim());
    });
    py.on('close', (code) => {
      if (code !== 0) {
        res.status(500).json({ error: 'Python script failed', details: errorOutput || output });
        return;
      }
      const match = output.match(/similarity ([0-9.]+)%/i);
      const similarity = match ? parseFloat(match[1]) : 0;
      const success = output.includes('Face accepted');
      // Delete local files after verification
      try {
        if (fs.existsSync(documentPath)) fs.unlinkSync(documentPath);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      } catch (err) {
        console.error('Error deleting local files:', err);
      }
      res.status(200).json({ success, similarity, output });
    });
    py.on('error', (err) => {
      res.status(500).json({ error: 'Failed to start Python process', details: err.message });
    });
  });
}