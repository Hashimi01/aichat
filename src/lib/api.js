export async function fetchNationalIds() {
  try {
    const response = await fetch('https://aichat-chi-ochre.vercel.app/api/data');
    
    if (!response.ok) {
      throw new Error('فشل في جلب بيانات الأرقام الوطنية');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching national IDs:', error);
    throw error;
  }
}

export async function checkNationalId(nationalId) {
  try {
    const ids = await fetchNationalIds();
    return ids.some(item => item.nationalId === nationalId);
  } catch (error) {
    console.error('Error checking national ID:', error);
    throw error;
  }
} 