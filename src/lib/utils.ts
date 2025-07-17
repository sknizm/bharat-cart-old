import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}


export function passwordHasher(passwword: string): Promise<string>{
  return new Promise((resolve, reject)=>{
      crypto.scrypt(passwword.normalize(),"salt", 64,(error, hash)=>{
          if(error) reject(error)
              resolve(hash.toString("hex").normalize())
      })
  })

}
export function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(plainPassword.normalize(), "salt", 64, (err, derivedKey) => {
      if (err) return reject(err);

      const derivedHash = derivedKey.toString("hex").normalize();
      resolve(derivedHash === hashedPassword.normalize());
    });
  });
}

export function SaltGenerator(){
  return crypto.randomBytes(16).toString("hex").normalize()
}