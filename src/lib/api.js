// lib/api.js
import { data } from '../app/api/data/route';

/**
 * Checks if a national ID exists in the database
 * @param {string} nationalId - The national ID to check
 * @returns {Promise<boolean>} - True if the national ID exists, false otherwise
 */
export async function checkNationalId(nationalId) {
  try {
    // Check if the national ID exists in the data
    const exists = data.some(item => item.nin === nationalId);
    return exists;
  } catch (error) {
    console.error('Error checking national ID:', error);
    throw new Error('حدث خطأ أثناء التحقق من الرقم الوطني');
  }
}

/**
 * Get user information by national ID
 * @param {string} nationalId - The national ID to look up
 * @returns {Promise<Object|null>} - User information or null if not found
 */
export async function getUserByNationalId(nationalId) {
  try {
    // Find the user with the matching national ID
    const user = data.find(item => item.nin === nationalId);
    return user || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('حدث خطأ أثناء جلب بيانات المستخدم');
  }
}