/**
 * src/services/api/contractService.ts
 * Contract CRUD and signing operations.
 */
import { db, logAction, nextCode } from '../../mock/database';
import type { Contract } from '../../types';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const contractService = {
  async getAll(): Promise<Contract[]> {
    await delay();
    return [...db.contracts];
  },

  async getById(id: string): Promise<Contract | undefined> {
    await delay(150);
    return db.contracts.find(c => c.id === id || c.code === id);
  },

  async create(data: Omit<Contract, 'id' | 'code' | 'status'>, actorName: string): Promise<Contract> {
    await delay(500);
    const contract: Contract = {
      id: String(Date.now()),
      code: nextCode('HĐ/2024/', db.contracts.length),
      status: 'cho_duyet',
      ...data,
    };
    db.contracts.push(contract);
    logAction(actorName, `Tạo hợp đồng ${contract.code}`, 'ContractManagement');
    return contract;
  },

  async sign(id: string, actorName: string): Promise<void> {
    await delay(400);
    const c = db.contracts.find(c => c.id === id);
    if (c) {
      c.status = 'da_ky';
      c.signedDate = new Date().toLocaleDateString('vi-VN');
      logAction(actorName, `Ký hợp đồng ${c.code}`, 'ContractManagement');
    }
  },

  async updateStatus(id: string, status: Contract['status'], actorName: string): Promise<void> {
    await delay(300);
    const c = db.contracts.find(c => c.id === id);
    if (c) {
      c.status = status;
      logAction(actorName, `Cập nhật hợp đồng ${c.code} → ${status}`, 'ContractManagement');
    }
  },
};
