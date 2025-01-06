// pages/api/createStudent.ts
import { getAdminServices } from "@/lib/firebaseAdmin";
const { adminAuth } = getAdminServices();
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Create a new user in Firebase Authentication
    const user = await adminAuth.createUser({
      email,
      password,
    });

    // Set the custom claims for the user to mark them as a 'student'
    await adminAuth.setCustomUserClaims(user.uid, { role: 'student' });
    console.log(`Assigned 'student' role to user with UID: ${user.uid}`);

    res.status(200).json({
        message: `User with email ${email} created successfully with role: student`,
        uid: user.uid, // Include UID in the response
      });
      
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
