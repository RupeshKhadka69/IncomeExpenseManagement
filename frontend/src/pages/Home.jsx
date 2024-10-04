import React from 'react'
import { useQuery } from "@tanstack/react-query";
import AdminServices from '../services/AdminService';
const Home = () => {
  const { data: apiCard, isLoading } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-quick-card-data"],
    select: (d) => d?.response,
    staleTime: 0,
    refetchInterval: 60000, //* every 1 minute
    // enabled: !!date?.fromDate && !!date?.toDate,
    refetchOnWindowFocus: false,
    retry: (count, { response }) => {
      return response?.status !== 403 && response?.status !== 404;
    },
  });
  console.log("data",apiCard)

  return (
    <div className='text-black'>
      {isLoading ? "loading": ""}
      Home sdvsdvsdddddddddd
      </div>
  )
}

export default Home