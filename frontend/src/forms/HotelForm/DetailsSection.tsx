import { useFormContext } from "react-hook-form";
import { HotelFormData2 } from "../HotelForm/ManageHotelForm2";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData2>();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Hotel Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Input Field */}
        <div>
          <label htmlFor="country" className="block text-gray-700 text-sm font-semibold mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            placeholder="Enter country"
            className={`shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.country ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <p className="text-red-600 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* City Input Field */}
        <div>
          <label htmlFor="city" className="block text-gray-700 text-sm font-semibold mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="Enter city"
            className={`shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.city ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
