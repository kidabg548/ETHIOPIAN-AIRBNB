import { FormProvider, useForm } from "react-hook-form";
import { HotelType, RoomType } from "../../../../backend/shared/types";
import { useEffect, useState } from "react";
import DetailsSection from "./DetailsSection";
import MapSection from "./MapSection";
import HotelDetail from "./HotelDetail";
import FacilitiesSection from "./FacilitiesSection";
import TypeSection from "./TypeSection";
import ImagesSection from "./ImagesSection";

import { FaCheckCircle } from "react-icons/fa";
import hotelImage from "../../assets/icon.png";
import RoomForm, { RoomFormData } from "./RoomForm2";

export type HotelFormData2 = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  // pdfFile?: File; // Add this line if you want to handle a PDF file

};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm2 = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData2>();
  const { handleSubmit, reset, setValue, getValues } = formMethods;

  // State for main stage navigation
  const [currentStage, setCurrentStage] = useState(1); // 1: Property Details, 2: Property Details Complete, 3: Add Room, 4: All Details Complete
  const [lastAddedRoom, setLastAddedRoom] = useState<RoomType | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  // State for property details step navigation
  const [propertyDetailsStep, setPropertyDetailsStep] = useState(1);
  const totalPropertySteps = 4; // Total steps for property details

  // State for room form step navigation
  const [roomFormStep, setRoomFormStep] = useState(1);
  const totalRoomFormSteps = 1; // Total steps for room form

  // State for storing the saved property details data
  const [savedPropertyDetails, setSavedPropertyDetails] =
    useState<HotelFormData2 | null>(null);
  const [isPropertyDetailsComplete, setIsPropertyDetailsComplete] =
    useState(false); // Track property details completion
  const [isRoomDetailsComplete, setIsRoomDetailsComplete] = useState(false); // Track room details completion

  // State for storing room form data
  const [roomData, setRoomData] = useState<RoomFormData>({
    roomType: "",
    capacity: 1,
    pricePerNight: 0,
    amenities: [],
    availability: true,
    numberOfRooms: 1, // Add number of rooms
    cancellationPolicy: "", // Add cancellationPolicy
  });

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData2) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("starRating", formDataJson.starRating.toString());
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

    if (formDataJson.location) {
      formData.append(
        "location[latitude]",
        formDataJson.location.latitude.toString()
      );
      formData.append(
        "location[longitude]",
        formDataJson.location.longitude.toString()
      );
    }

    // if (formDataJson.pdfFile) {
    //   formData.append("pdfFile", formDataJson.pdfFile);
    // }
    // Append room data to formData
    formData.append("roomType", roomData.roomType);
    formData.append("capacity", roomData.capacity.toString());
    formData.append("pricePerNight", roomData.pricePerNight.toString());
    formData.append("numberOfRooms", roomData.numberOfRooms.toString());
    formData.append("amenities", JSON.stringify(roomData.amenities));
    formData.append("availability", roomData.availability.toString());
    formData.append("cancellationPolicy", roomData.cancellationPolicy); // Add cancellationPolicy

    onSave(formData);
  });

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setValue("location", location);
  };

  const handleRoomDataChange = (newRoomData: RoomFormData) => {
    setRoomData(newRoomData);
  };

  const initialLocation = hotel?.location || {
    latitude: 9.0245,
    longitude: 38.7426,
  }; // Default location

  const handlePropertyDetailsNextStep = () => {

    
    if (propertyDetailsStep < totalPropertySteps) {
      setPropertyDetailsStep(propertyDetailsStep + 1);
    } else {
      // Save property details data
      const propertyDetails = getValues();
      setSavedPropertyDetails(propertyDetails);
      setIsPropertyDetailsComplete(true); // Mark as complete
      setCurrentStage(2); // Move to Property Details Complete stage
    }
  };

  useEffect(() => {
    console.log(savedPropertyDetails); // Log whenever savedPropertyDetails changes
  }, [savedPropertyDetails]);

  const handlePropertyDetailsPreviousStep = () => {
    if (propertyDetailsStep > 1) {
      setPropertyDetailsStep(propertyDetailsStep - 1);
    }
  };

  const handleRoomFormNextStep = () => {
    if (roomFormStep < totalRoomFormSteps) {
      setRoomFormStep(roomFormStep + 1);
    } else {
      // Store the room data in the rooms state
      setRooms([
        ...rooms,
        {
          _id: "", // You don't need an ID here as it's not saved
          hotelId: "", // Replace with your hotel's ID or logic to get it
          roomType: roomData.roomType,
          capacity: roomData.capacity,
          pricePerNight: roomData.pricePerNight,
          amenities: roomData.amenities,
          availability: roomData.availability,
          numberOfRooms: roomData.numberOfRooms,
          imageUrl: "", // Add an optional image URL if needed
          cancellationPolicy: roomData.cancellationPolicy, // Add cancellationPolicy
        },
      ]);

      setIsRoomDetailsComplete(true); // Mark room details as complete
      setCurrentStage(4); // Move to All Details Complete stage
    }
  };

  const handleRoomFormPreviousStep = () => {
    if (roomFormStep > 1) {
      setRoomFormStep(roomFormStep - 1);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-10 space-y-10"
        onSubmit={onSubmit}
      >
        {currentStage === 1 && (
          <div>
            {/* Property Details Section */}
            {propertyDetailsStep === 1 && (
              <div>
                <DetailsSection />
                <div>
                  <MapSection
                    onLocationSelect={handleLocationSelect}
                    initialLocation={initialLocation}
                  />
                </div>
              </div>
            )}
            {propertyDetailsStep === 2 && (
              <div>
                <HotelDetail />
              </div>
            )}
            {propertyDetailsStep === 3 && (
              <div>
                <FacilitiesSection />
                <TypeSection />
              </div>
            )}
            {propertyDetailsStep === 4 && (
              <div>
                <ImagesSection />
              </div>
            )}

            {/* Property Details Navigation */}
            <div className="flex justify-between mt-4">
              {propertyDetailsStep > 1 && (
                <button
                  type="button"
                  onClick={handlePropertyDetailsPreviousStep}
                  className="bg-gray-300 text-gray-700 text-xl font-bold py-2 px-4 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
              )}
              {propertyDetailsStep < totalPropertySteps ? (
                <button
                  type="button"
                  onClick={handlePropertyDetailsNextStep}
                  className="bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded hover:bg-blue-500"
                >
                  Next
                </button>
              ) : (
                // Display a 'Complete' button when on the last step of Property Details
                <button
                  type="button"
                  onClick={handlePropertyDetailsNextStep} // Move to Property Details Complete Stage
                  className="bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded hover:bg-blue-500"
                >
                  Complete Property Details
                </button>
              )}
            </div>
          </div>
        )}

        {/* Property Details Complete Stage */}

        {currentStage === 2 && (
          <div className="mt-10">
            {/* Card for Property Details Completion */}
            {isPropertyDetailsComplete && (
              <div
                className="bg-green-100 border border-green-400 text-black-700 px-4 py-5 rounded relative m-4"
                role="alert"
              >
                <span className="flex text-sm justify-start ml-10">Step 1</span>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-3xl" />
                  <strong className="font-bold">
                    Property details completed
                  </strong>
                </div>
                <span className="flex text-sm justify-start ml-8">
                  "The basics. Add your property name, address, facilities and
                  more."
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStage(1);
                    setPropertyDetailsStep(1);
                    setIsPropertyDetailsComplete(false); // Reset completion status
                  }}
                  className="absolute top-0 right-0 px-4 py-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}

            {/* Card for Adding Room Details */}
            {isPropertyDetailsComplete && (
              <div
                className="bg-white border border-blue-400 text-black px-4 py-5 rounded relative m-4 flex flex-col"
                role="alert"
              >
                <span className="flex text-sm justify-start ml-10">Step 2</span>
                <div className="flex items-center">
                  <img
                    src={hotelImage}
                    alt="Apartment"
                    className="mb-4 w-8 h-7 mr-2 "
                  />
                  <strong className="font-bold">Rooms</strong>
                </div>
                <span className="flex text-sm justify-start ml-8">
                  "Tell us about your first room. Once you've set one up you can
                  add more."
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRoomFormStep(1);
                    setCurrentStage(3); // Move to Add Room stage
                  }}
                  className="absolute top-0 right-0 px-4 py-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  Add room
                </button>
              </div>
            )}
          </div>
        )}

        {/* Room Form Stage */}
        {currentStage === 3 && (
          <div>
            {/* Room Form Steps */}
            {roomFormStep === 1 && (
              <div>
                <RoomForm onRoomDataChange={handleRoomDataChange} />
              </div>
            )}
            {/* ... Add the remaining steps for the room form */}

            {/* Room Form Navigation */}
            <div className="flex justify-between mt-4">
              {roomFormStep > 1 && (
                <button
                  type="button"
                  onClick={handleRoomFormPreviousStep}
                  className="bg-gray-300 text-gray-700 text-xl font-bold py-2 px-4 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
              )}
              {roomFormStep <= totalRoomFormSteps ? (
                <button
                  type="button"
                  onClick={handleRoomFormNextStep}
                  className="bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded hover:bg-blue-500"
                >
                  Next
                </button>
              ) : (
                // Display a 'Complete' button when on the last step of Room Form
                <button
                  type="button"
                  onClick={handleRoomFormNextStep} // Move to All Details Complete Stage
                  className="bg-blue-600 text-white text-xl font-bold py-2 px-4 rounded hover:bg-blue-500"
                >
                  Complete Room Details
                </button>
              )}
            </div>
          </div>
        )}

        {/* All Details Complete Stage */}

        {currentStage === 4 && (
          <div className="mt-10">
            <div
              className="bg-green-100 border border-green-400 text-black-700 px-4 py-5 rounded relative m-4"
              role="alert"
            >
              <span className="flex text-sm justify-start ml-10">Step 1</span>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2 text-3xl" />
                <strong className="font-bold">
                  Property details completed
                </strong>
              </div>
              <span className="flex text-sm justify-start ml-8">
                "The basics. Add your property name, address, facilities and
                more."
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentStage(1);
                  setPropertyDetailsStep(1);
                  setIsPropertyDetailsComplete(false); // Reset completion status
                }}
                className="absolute top-0 right-0 px-4 py-2 text-sm font-bold text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
            {rooms.length > 0 && ( // Only display if there are rooms
              <div
                className="bg-green-100 border border-green-400 text-black-700 px-4 py-5 rounded relative m-4"
                role="alert"
              >
                <span className="flex text-sm justify-start ml-10">Step 2</span>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2 text-3xl" />
                  <strong className="font-bold">Room details completed</strong>
                </div>
                <span className="flex text-sm justify-start ml-8">
                  "All details have been added. Please review and save"
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStage(3);
                    setRoomFormStep(1);
                    setIsRoomDetailsComplete(false); // Reset completion status
                  }}
                  className="absolute top-0 right-0 px-4 py-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}

            {rooms.length > 0 && ( // Only display if there are rooms
              <div className="mt-4 ">
                {/* Render rooms */}
                {rooms.map((room, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mt-3"
                   >
                    <div className="flex items-center">
                      <div className="w-24 h-16 mr-4">
                        {/* Add a placeholder image if room.imageUrl is not available. */}
                        <img
                          src={
                            room.imageUrl || "https://via.placeholder.com/150"
                          }
                          alt={room.roomType}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{room.roomType}</p>
                        <p className="text-sm">
                          Price: US${room.pricePerNight}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStage(3); // Go to Add Room stage
                    setRoomFormStep(1); // Reset the step to 1
                    setIsRoomDetailsComplete(false); // Reset the completion status
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Add another room
                </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="text-1xl bg-blue-600 top-0 right-0 px-4 py-2 font-bold text-white border rounded-lg hover:underline"
            >
              {isLoading ? "Complete Registration..." : "Complete Registration"}
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm2;