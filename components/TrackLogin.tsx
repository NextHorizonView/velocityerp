import { doc, updateDoc } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebaseConfig";

async function trackLogout(userId: string): Promise<void> {
  const { db } = getFirebaseServices(); // Get Firestore instance

  try {
    // Update the document in the "LoggedInUsers" collection
    await updateDoc(doc(db, "LoggedInUsers", userId), {
      IsLoggedIn: false,
    });
    console.log("User logout tracked successfully!");
  } catch (error) {
    // Log the error details
    console.error("Error tracking logout:", error instanceof Error ? error.message : error);
  }
}

export default trackLogout;
