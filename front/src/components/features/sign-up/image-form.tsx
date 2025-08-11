import { ImagePlus } from "lucide-react";
import { SignUpFormProps } from "./sign-up-form";
import Image from "next/image";

export function ImageForm({
  formData,
  setFormData,
}: SignUpFormProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="w-full">
        <input
          id="upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setFormData((prev) => ({
              ...prev,
              restaurant: {
                ...prev.restaurant,
                imageFiles: [file, ...prev.restaurant.imageFiles],
              },
            }));
          }}
        />
        <label
          htmlFor="upload"
          className="w-full aspect-square border border-black border-dashed bg-white rounded-xl flex justify-center items-center"
        >
          <ImagePlus className="w-8 h-8" />
        </label>
      </div>

      {formData.restaurant.imageFiles.map((file, index) => (
        <div
          key={index}
          className="w-full aspect-square overflow-hidden flex items-center bg-gray rounded-xl"
        >
          <Image
            width={100}
            height={100}
            alt={`imageFile ${index}`}
            src={URL.createObjectURL(file)}
            className="w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
