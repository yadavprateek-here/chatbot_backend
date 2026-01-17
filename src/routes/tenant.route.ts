import { Router } from 'express';
import { TenantModel } from '../models/tenant.model';

const router = Router();

/**
 * GET all tenants
 */
router.get('/', async (_req, res) => {
  const tenants = await TenantModel.find().lean();
  res.json(tenants);
});

/**
 * CREATE tenant
 */
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const tenantId = `tenant_${Date.now()}`;

  const tenant = await TenantModel.create({
    _id: tenantId, // 🔥 FIX
    name
  });

  res.status(201).json(tenant);
});

export default router;

// aibot key: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 
// hmm key :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
