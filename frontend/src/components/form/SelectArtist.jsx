import React, { useState, useEffect } from "react";
import ArtistServices from "../../services/ArtistServices";
import { notifyError } from "../../utils/toast";
// import useEventSubmit from "../../hooks/useEventSubmit";

const SelectArtist = (props) => {
  const { register, name, label } = props;
  const [artistData, setArtistData] = useState([]);
  //   const { artistData } = useEventSubmit();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await ArtistServices.fetchAllArtist();
        setArtistData(res?.artist);
      } catch (error) {
        notifyError(error ? error.response?.data.error.msg : error.message);
      }
    };
    fetchArtist();
  }, []);

  return (
    <>
      <select
        className="border  h-12 text-sm focus:outline-none block w-full dark:bg-gray-800 focus:bg-white form-select rounded-md dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="" selected>
          --- Select Artist ---
        </option>
        {artistData ? (
          artistData?.map((data) => (
            <option key={data?._id} value={data?._id} className="capitalize">
              {data?.name}
            </option>
          ))
        ) : (
          <>
            <option>No Artist Found</option>
          </>
        )}
      </select>
    </>
  );
};

export default SelectArtist;
