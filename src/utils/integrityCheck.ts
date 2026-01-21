/**
 * Simple integrity checking for localStorage data to detect tampering.
 * Note: This is a client-side defense-in-depth measure. For true security,
 * backend validation is required.
 */

const INTEGRITY_SECRET = 'electvote_integrity_v1';

// Simple hash function for integrity checking
async function generateChecksum(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + INTEGRITY_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface SecureStorageData<T> {
  data: T;
  checksum: string;
  timestamp: number;
}

/**
 * Store data with integrity checksum
 */
export async function setSecureStorage<T>(key: string, data: T): Promise<void> {
  const dataString = JSON.stringify(data);
  const checksum = await generateChecksum(dataString);
  
  const secureData: SecureStorageData<T> = {
    data,
    checksum,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(key, JSON.stringify(secureData));
}

/**
 * Retrieve data and verify integrity
 * Returns null if data is tampered or missing
 */
export async function getSecureStorage<T>(key: string): Promise<T | null> {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const parsed: SecureStorageData<T> = JSON.parse(stored);
    
    // Verify checksum
    const expectedChecksum = await generateChecksum(JSON.stringify(parsed.data));
    
    if (expectedChecksum !== parsed.checksum) {
      console.warn(`[Security] Integrity check failed for ${key} - data may have been tampered`);
      // Clear tampered data
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error(`[Security] Failed to read secure storage for ${key}:`, error);
    return null;
  }
}

/**
 * Remove data from secure storage
 */
export function removeSecureStorage(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Check if data has been tampered
 */
export async function isDataTampered(key: string): Promise<boolean> {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    
    const parsed: SecureStorageData<unknown> = JSON.parse(stored);
    const expectedChecksum = await generateChecksum(JSON.stringify(parsed.data));
    
    return expectedChecksum !== parsed.checksum;
  } catch {
    return true;
  }
}
