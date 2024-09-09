import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData2 } from "../HotelForm/ManageHotelForm2";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData2>();

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-6">
      <h2 className="block text-gray-700 text-lg font-bold mb-2">Facilities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="flex items-center text-gray-700 text-sm font-semibold"
          >
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
              className="mr-2 rounded-full border-gray-300 focus:ring-blue-500"
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold block mt-2">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;