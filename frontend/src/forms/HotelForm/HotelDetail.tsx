import { useFormContext } from "react-hook-form";
import { HotelFormData2 } from "../HotelForm/ManageHotelForm2";

const HotelDetail = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData2>();

  return (
    <div className="bg-white rounded-lg p-8 shadow-md space-y-6">
      <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-8">Add Hotel</h1>
      
      <label className="block">
        <span className="text-gray-700 text-lg font-semibold">Name</span>
        <input
          type="text"
          placeholder="Enter hotel name"
          className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500 text-xs mt-2">{errors.name.message}</span>
        )}
      </label>

      <label className="block">
        <span className="text-gray-700 text-lg font-semibold">Description</span>
        <textarea
          placeholder="Enter hotel description"
          rows={5}
          className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500 text-xs mt-2">{errors.description.message}</span>
        )}
      </label>

      <div className="block">
        <span className="text-gray-700 text-lg font-semibold">Star Rating</span>
        <div className="mt-2 flex flex-col space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              value="N/A"
              className="mr-2"
              {...register("starRating", { required: "This field is required" })}
            />
            <span>N/A</span>
          </div>
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <input
                type="radio"
                value={num}
                className="mr-2"
                {...register("starRating", { required: "This field is required" })}
              />
              <span>{num} star{num > 1 && "s"}</span>
              <div className="ml-4 flex">
                {[...Array(num)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span> 
                ))}
                {[...Array(5 - num)].map((_, i) => (
                  <span key={i} className="text-gray-400 text-2xl">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {errors.starRating && (
          <span className="text-red-500 text-xs mt-2">{errors.starRating.message}</span>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;