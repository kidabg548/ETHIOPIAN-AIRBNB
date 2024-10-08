import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/shared/types";
import { useEffect } from "react";
import MapSection from "./MapSection";


export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset, setValue } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    // Append location data
    if (formDataJson.location) {
      formData.append("location[latitude]", formDataJson.location.latitude.toString());
      formData.append("location[longitude]", formDataJson.location.longitude.toString());
    }

    onSave(formData);
  });

  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    setValue("location", location);
  };

  const initialLocation = hotel?.location || { latitude: 9.0245, longitude: 38.7426 }; // Default to London if no location provided

  return (
    <FormProvider {...formMethods}>
      <form className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-10 space-y-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />

        {/* Map Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Pin Your Location</h3>
          <MapSection 
            onLocationSelect={handleLocationSelect} 
            initialLocation={initialLocation} 
          />
        </div>

        <div className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded hover:bg-blue-500 disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;