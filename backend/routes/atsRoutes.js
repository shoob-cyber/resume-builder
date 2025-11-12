import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();
const upload = multer();

// This route accepts a single file field named 'resume' and a text field 'jd'.
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const microserviceUrl = process.env.ATS_SERVICE_URL || 'http://127.0.0.1:8001/api/analyze';

    const form = new FormData();

    if (req.file) {
      form.append('resume', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    // JD may be sent as a field in the multipart form
    if (req.body && req.body.jd) {
      form.append('jd', req.body.jd);
    }

    const headers = form.getHeaders();

    const response = await axios.post(microserviceUrl, form, {
      headers,
      maxBodyLength: Infinity,
      timeout: 120000,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Error proxying to ATS microservice:', err.message || err);
    if (err.response && err.response.data) {
      res.status(err.response.status || 500).json(err.response.data);
    } else {
      res.status(500).json({ error: 'Failed to analyze resume. Is the ATS microservice running?' });
    }
  }
});

export default router;
