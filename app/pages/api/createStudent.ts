import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { emailForAuth, password } = req.body;

    if (!emailForAuth || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    try {
      const userRecord = await adminAuth.createUser({
        email: emailForAuth,
        password,
      });

      await adminAuth.setCustomUserClaims(userRecord.uid, {
        role: "student", 
      });

      res.status(200).json({ message: "Student created successfully!" });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ error: "Error creating student" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
