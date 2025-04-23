// نظام تخزين ثابت للـ OTP باستخدام localStorage
// يضمن عدم تغير الرمز لمدة 10 دقائق كاملة

// مدة صلاحية OTP بالمللي ثانية (10 دقائق = 600000 مللي ثانية)
const OTP_EXPIRY = 10 * 60 * 1000; 

// اسم مفتاح التخزين في localStorage
const STORAGE_KEY = 'persistentOtpStorage';

// تخزين مؤقت للرموز في الذاكرة
let otpStore = new Map();

/**
 * تحميل بيانات OTP من localStorage
 */
function loadFromStorage() {
  try {
    // التحقق من وجود localStorage (يتوفر فقط في المتصفح)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        // استعادة البيانات بغض النظر عن حالة صلاحيتها
        // حتى نحافظ على سلوك ثابت للرموز
        Object.entries(parsedData).forEach(([userId, data]) => {
          otpStore.set(userId, data);
        });
        
        console.log(`Loaded ${otpStore.size} OTP codes from storage.`);
      }
    }
  } catch (error) {
    console.error('Error loading OTP from storage:', error);
  }
}

/**
 * حفظ بيانات OTP في localStorage
 */
function saveToStorage() {
  try {
    if (typeof window !== 'undefined') {
      const dataObject = {};
      
      // تحويل Map إلى كائن للتخزين
      otpStore.forEach((value, key) => {
        dataObject[key] = value;
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataObject));
    }
  } catch (error) {
    console.error('Error saving OTP to storage:', error);
  }
}

// تحميل البيانات عند بدء التشغيل
loadFromStorage();

// طباعة معلومات عن الرموز النشطة بشكل دوري
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    
    let activeCount = 0;
    otpStore.forEach(value => {
      if (value.expiryTime > now) activeCount++;
    });
    
    console.log(`Active OTPs: ${activeCount}/${otpStore.size}`);
  }, 60000); // كل دقيقة
}

/**
 * إنشاء أو استرجاع رمز OTP للمستخدم
 * إذا كان هناك رمز موجود (بغض النظر عن صلاحيته)، سيتم إرجاع الرمز الموجود
 * إذا انتهت صلاحية الرمز (10 دقائق)، سيتم إنشاء رمز جديد
 * @param {string} userId - معرف المستخدم (مثل الرقم الوطني)
 * @returns {Object} - كائن يحتوي على رمز OTP والحالة
 */
export function generateOTP(userId) {
  const now = Date.now();
  
  // التحقق من وجود رمز سابق
  const existingData = otpStore.get(userId);
  
  // إذا كان هناك رمز موجود، نتحقق من صلاحيته
  if (existingData) {
    const isActive = existingData.expiryTime > now;
    
    // إذا كان الرمز لا يزال صالحاً، نعيده كما هو
    if (isActive) {
      console.log(`Reusing active OTP for ${userId}. Remaining time: ${Math.ceil((existingData.expiryTime - now) / 1000)} seconds`);
      return {
        otp: existingData.otp,
        isNewlyGenerated: false,
        remainingTime: Math.ceil((existingData.expiryTime - now) / 1000)
      };
    } 
    // إذا انتهت صلاحية الرمز، نقوم بإنشاء رمز جديد
    else {
      console.log(`Previous OTP for ${userId} expired. Generating new OTP.`);
    }
  }
  
  // إنشاء رمز OTP جديد من 6 أرقام
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // تخزين OTP مع وقت انتهاء الصلاحية
  const expiryTime = now + OTP_EXPIRY;
  otpStore.set(userId, { 
    otp, 
    expiryTime, 
    createdAt: now 
  });
  
  // حفظ البيانات في التخزين
  saveToStorage();
  
  console.log(`Generated new OTP for ${userId}. Valid for ${OTP_EXPIRY / 1000} seconds.`);
  
  return {
    otp,
    isNewlyGenerated: true,
    remainingTime: OTP_EXPIRY / 1000
  };
}

/**
 * التحقق من رمز OTP
 * @param {string} userId - معرف المستخدم (مثل الرقم الوطني)
 * @param {string} otp - رمز OTP المدخل
 * @returns {boolean} - صحيح إذا كان الرمز صحيحًا ولم تنتهِ صلاحيته
 */
export function verifyOTP(userId, otp) {
  const otpData = otpStore.get(userId);
  
  // التحقق من وجود OTP
  if (!otpData) {
    return false;
  }
  
  // التحقق من انتهاء الصلاحية
  if (Date.now() > otpData.expiryTime) {
    return false; // رمز منتهي الصلاحية
  }
  
  // التحقق من تطابق OTP
  return otpData.otp === otp;
}

/**
 * الحصول على المدة المتبقية لصلاحية OTP بالثواني
 * @param {string} userId - معرف المستخدم
 * @returns {number} - المدة المتبقية بالثواني أو 0 إذا انتهت الصلاحية
 */
export function getOTPRemainingTime(userId) {
  const otpData = otpStore.get(userId);
  
  if (!otpData) {
    return 0;
  }
  
  const remainingMs = otpData.expiryTime - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

/**
 * الحصول على رمز OTP الحالي للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {string|null} - رمز OTP الحالي أو null إذا لم يوجد
 */
export function getCurrentOTP(userId) {
  const otpData = otpStore.get(userId);
  
  if (!otpData) {
    return null;
  }
  
  // ملاحظة: نقوم بإرجاع الرمز حتى لو انتهت صلاحيته
  // يمكن للمستدعي التحقق من الصلاحية باستخدام getOTPRemainingTime
  return otpData.otp;
}

/**
 * الحصول على حالة OTP للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Object} - كائن يحتوي على معلومات عن OTP
 */
export function getOtpStatus(userId) {
  const otpData = otpStore.get(userId);
  const now = Date.now();
  
  if (!otpData) {
    return {
      exists: false,
      active: false,
      remainingTime: 0
    };
  }
  
  return {
    exists: true,
    active: otpData.expiryTime > now,
    remainingTime: Math.max(0, Math.ceil((otpData.expiryTime - now) / 1000)),
    createdAt: otpData.createdAt
  };
}

/**
 * الحصول على جميع رموز OTP النشطة
 * @returns {Object} - كائن يحتوي على معلومات عن OTPs النشطة
 */
export function getActiveOTPs() {
  const allOTPs = {};
  const now = Date.now();
  
  otpStore.forEach((value, key) => {
    // إرجاع جميع الرموز بغض النظر عن صلاحيتها
    allOTPs[key] = {
      otp: value.otp,
      remainingTime: Math.max(0, Math.ceil((value.expiryTime - now) / 1000)),
      active: value.expiryTime > now,
      createdAt: value.createdAt,
      expiryTime: value.expiryTime
    };
  });
  
  return allOTPs;
}