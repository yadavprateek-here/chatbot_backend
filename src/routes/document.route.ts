import { Router } from 'express';
import { DocumentModel } from '../models/document.model';

const router = Router();

// 🔹 Get documents for tenant
router.get('/tenants/:tenantId/documents', async (req, res) => {
  const { tenantId } = req.params;
  const docs = await DocumentModel.find({ tenantId });
  res.json(docs);
});

// 🔹 Create document
router.post('/documents', async (req, res) => {
  const { tenantId, title, content, type } = req.body;

  if (!tenantId || !title || !content) {
    return res.status(400).json({ error: 'Invalid document payload' });
  }

  const tokens = Math.ceil(content.length / 4);

  const doc = await DocumentModel.create({
    tenantId,
    title,
    content,
    type,
    tokens
  });

  res.json(doc);
});

// 🔹 Delete document
router.delete('/documents/:id', async (req, res) => {
  await DocumentModel.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
