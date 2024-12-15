// EditButton.tsx
import React from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

interface EditButtonProps {
  fieldId: string;
}

const EditButton: React.FC<EditButtonProps> = ({ fieldId }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit-field/${fieldId}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-8 h-8 p-0"
      onClick={handleEdit}
    >
      <span className="sr-only">Edit Field</span>
      <Edit className="h-4 w-4" />
    </Button>
  );
};

export default EditButton;
