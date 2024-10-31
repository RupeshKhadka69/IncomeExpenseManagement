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
    <div className="overflow-x-auto mt-5">
      <table className="w-full divide-y divide-gray-400 dark:divide-gray-700">
        <thead className="dark:text-gray-300 text-gray-400">
          <tr>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Name
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Amount
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Category
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Date
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Description
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">{item?.name}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">{item?.amount}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
                  {item?.category}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
                  {item?.date && getLocalADBSDate("bs", item?.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left">
                  {item?.description}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs font-normal text-left flex gap-2 items-center">
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