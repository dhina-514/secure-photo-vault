import CryptoJS from "crypto-js";

// Read file as base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1]; // remove `data:...base64,`
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Encrypt base64 string with password
export function encryptBase64(base64Data, password) {
  const ciphertext = CryptoJS.AES.encrypt(base64Data, password).toString();
  return ciphertext;
}

// Decrypt ciphertext back to base64
export function decryptToBase64(ciphertext, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const base64 = bytes.toString(CryptoJS.enc.Utf8);
    if (!base64) return null;
    return base64;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

// Convert base64 to Blob URL (for img src)
export function base64ToImageUrl(base64, mimeType = "image/jpeg") {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
