import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminServices from "../services/AdminService";

const Header = () => {
  const { data, refetch, isLoading } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-user"],
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
  });

  return (
    <header className="h-16 px-4 bg-green-200 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-green-800">Logo</div>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 shadow-sm">
          {data?.profile_picture && (
            <img 
              src={data.profile_picture} 
              alt={`${data?.username}'s profile`}
              className="w-full h-full object-cover"
            />
          ) }
        </div>
        <span className="font-medium text-green-800">
          {data?.username || 'Guest'}
        </span>
      </div>
    </header>
  );
};

export default Header;