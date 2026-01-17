import { TenantModel } from '../models/tenant.model';
import { DocumentModel } from '../models/document.model';

export class TenantService {

  history: any[] = [];
  async getTenant(companyId: string): Promise<{
    _id: string;
    name: string;
    systemInstruction: string;
    status: 'active' | 'inactive';
  }> {
    const tenant = await TenantModel.findById(companyId).lean();

    if (!tenant) {
      throw new Error('Invalid tenant');
    }

    if (tenant.status !== 'active') {
      throw new Error('Tenant is inactive');
    }

    return tenant as {
      _id: string;
      name: string;
      systemInstruction: string;
      status: 'active' | 'inactive';
    };
  }

  async getDocuments(companyId: string): Promise<string[]> {
    const docs = await DocumentModel
      .find({ tenantId: companyId })
      .sort({ createdAt: 1 })
      .lean();

    return docs.map(doc => `[${doc.title}]\n${doc.content}`);
  }

  buildConversationMemory(history: any[], limit = 10) {
  return this.history.slice(-limit).map(m => ({
    role: m.role,
    content: m.content
  }));
}
  
}
