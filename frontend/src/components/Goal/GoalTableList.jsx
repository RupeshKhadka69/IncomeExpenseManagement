import { getLocalADBSDate } from "../../utils/date";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Modal } from "antd";
import GoalServices from "../../services/GoalService";
import { notifySuccess, notifyError } from "../../utils/Toast";

const GoalTableList = ({ data, refetch }) => {
  const navigate = useNavigate();
  const handleFollowClick = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Goal?",
      async onOk() {
        console.log("id", id);
        try {
          const res = await GoalServices.DeleteSigleGoal(id);
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
    <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Target Amount</th>
            <th className="px-6 py-3">Current Amount</th>
            <th className="px-6 py-3">Deadline</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="text-xs  text-left px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item?.name}
                </td>
                <td className="px-6 py-3">{item?.targetAmount}</td>

                <td className="px-6 py-3">{item?.currentAmount}</td>
                <td className="px-6 py-3">
                  {item?.deadline && getLocalADBSDate("bs", item?.deadline)}
                </td>
                <td className="px-6 py-3 flex gap-2 items-center">
                  <Tooltip title="Edit">
                    <span
                      className="cursor-pointer"
                      onClick={() => navigate(`edit-goal/${item?._id}`)}
                    >
                      <FaRegEdit size={18} />
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => handleFollowClick(item?._id)}
                    >
                      <MdOutlineDeleteOutline size={20} />
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

export default GoalTableList;
