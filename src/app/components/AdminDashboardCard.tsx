import Image, { StaticImageData } from "next/image";
import React from "react";

interface AdminDashboardCardProps {
  title: string;
  image: string | StaticImageData;
  number: string | number;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({
  title,
  image,
  number,
}) => {
  return (
    <div className="bg-white flex items-center justify-between p-4 rounded-md hover:border-[#379E37] duration-500 cursor-pointer">
      <Image src={image} width={55} alt="" height={30} />
      <div className="text-center w-[70%] ml-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <h1 className="font-extrabold text-3xl">{number}</h1>{" "}
        {/* Placeholder counts */}
      </div>
    </div>
  );
};

export default AdminDashboardCard;
