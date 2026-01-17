import { Router } from 'express';
import { chat } from '../services/ai-orchestrator';

const router = Router();

router.post('/message', async (req, res) => {
  const { companyId, message, history } = req.body;

  if (!companyId || !message) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const reply = await chat(companyId, message, history || []);
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: 'Server error' });
  }
});

export default router;
