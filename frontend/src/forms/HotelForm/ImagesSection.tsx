import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HotelFormData2 } from "../HotelForm/ManageHotelForm2";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData2>();

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const existingImageUrls = watch("imageUrls");

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Images</h2>
      <div className="flex flex-col gap-4">
        {/* Existing Image URLs */}
        {existingImageUrls && existingImageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImageUrls.map((url) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-md shadow-sm"
                />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Preview Uploaded Images */}
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md shadow-sm"
                />
                <button
                  onClick={() =>
                    setPreviewUrls(previews => previews.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Upload Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          className={`block w-full text-gray-700 border border-gray-300 rounded-md py-2 px-3 mt-4 ${
            errors.imageFiles ? "border-red-500" : ""
          }`}
          {...register("imageFiles", {
            onChange: handleFileChange,
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImageUrls?.length || 0);

              if (totalLength === 0) {
                return "At least one image should be added";
              }

              if (totalLength > 10) {
                return "Total number of images cannot be more than 10";
              }

              return true;
            },
          })}
        />
        {errors.imageFiles && (
          <span className="text-red-500 text-sm mt-2 block">
            {errors.imageFiles.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
