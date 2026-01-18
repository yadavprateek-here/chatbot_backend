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

