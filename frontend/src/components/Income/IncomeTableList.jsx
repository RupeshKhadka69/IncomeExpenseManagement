import { getLocalADBSDate } from "../../utils/date";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {Modal} from "antd";
import IncomeServices from "../../services/IncomeService";
import { notifySuccess,notifyError } from "../../utils/Toast";

const IncomeTableList = ({ data,refetch }) => {
  const navigate = useNavigate();
  const handleFollowClick = (id) => {
  

    Modal.confirm({
      title: "Are you sure you want to delete this Expense?",
      async onOk() {
        console.log("id",id)
        try {
          const res = await IncomeServices.DeleteSigleIncome(
            id,
          );
          notifySuccess(res.message);
          await refetch();
        } catch (e) {
          notifyError(e?.response?.message);
        }
      },
      okButtonProps: {
        className: "custom-cancel-button",
      },
      cancelButtonProps: {
        className: "custom-ok-button",
      },
    });
  };

  return (
    <div className=" relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">
              Name
            </th>
            <th className="px-6 py-3">
              Amount
            </th>
            <th className="px-6 py-3">
              Category
            </th>
            <th className="px-6 py-3">
              Date
            </th>
            <th className="px-6 py-3">
              Description
            </th>
            <th className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="text-xs  text-left px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item?.name}</td>
                <td className="px-6 py-4">{item?.amount}</td>
                <td className="px-6 py-4">
                  {item?.category}
                </td>
                <td className="px-6 py-4">
                  {item?.date && getLocalADBSDate("bs", item?.date)}
                </td>
                <td className="px-6 py-4">
                  {item?.description}
                </td>
                <td className="px-6 py-4 flex gap-2 items-center">
                <Tooltip title="Edit">
                  <span className="cursor-pointer" onClick={() => navigate(`edit-income/${item?._id}`)}>
                    <FaRegEdit size={18} />
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <button type="button" className="cursor-pointer" onClick={()=> handleFollowClick(item?._id)}>
                    <MdOutlineDeleteOutline  size={20} />
                  </button>
                </Tooltip>
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeTableList;
