// pages/api/createStudent.ts
import { getAdminServices } from "@/lib/firebaseAdmin";
const { adminAuth, adminFirestore } = getAdminServices(); // Correct property name is 'adminFirestore'
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Hardcode the roleId to 'student'
  const roleId = "student";

  try {
    // Fetch the 'student' role document from Firestore
    const roleDoc = await adminFirestore.collection("Role").doc(roleId).get(); // Use 'adminFirestore'
    if (!roleDoc.exists) {
      return res.status(404).json({ error: `Role with ID '${roleId}' does not exist` });
    }

    const roleData = roleDoc.data();

    // Create a new user in Firebase Authentication
    const user = await adminAuth.createUser({
      email,
      password,
    });

    // Assign the 'student' role to the new user
    await adminAuth.setCustomUserClaims(user.uid, { role: roleData?.RoleId });

    console.log(`Assigned '${roleData?.RoleName}' role to user with UID: ${user.uid}`);

    res.status(200).json({
      message: `User with email ${email} created successfully with role: ${roleData?.RoleName}`,
      uid: user.uid,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}
