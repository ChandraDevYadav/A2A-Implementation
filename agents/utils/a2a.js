import crypto from "crypto";

export const generateKeys = () =>
  crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

export const signPayload = (payload, privateKey) =>
  crypto
    .sign("sha256", Buffer.from(JSON.stringify(payload)), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    })
    .toString("base64");

export const verifyPayload = (payload, signature, publicKey) =>
  crypto.verify(
    "sha256",
    Buffer.from(JSON.stringify(payload)),
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
    Buffer.from(signature, "base64")
  );
