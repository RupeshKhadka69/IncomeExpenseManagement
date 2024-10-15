import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SidebarContext } from "../../context/SidebarContext";

const DrawerButton = ({
  id,
  title,
  showCustom = false,
  customAdd = "",
  customUpdate = "",
}) => {
  const { t } = useTranslation();
  const { toggleDrawer } = useContext(SidebarContext);
  return (
    <>
      <div className="flex  bottom-0 mt-10 w-full right-0 py-4 lg:py-4 px-6  gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 ">
        <button
          type="button"
          onClick={toggleDrawer}
          className="h-12 w-full hover:bg-gray-200 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-md dark:hover:bg-gray-600 px-4"
          layout="outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full px-4 h-12 rounded-md text-white bg-primary hover:bg-opacity-90"
        >
          {" "}
          {id ? (
            showCustom ? (
              <span>{customUpdate}</span>
            ) : (
              <span>Update&nbsp;{title}</span>
            )
          ) : showCustom ? (
            <span>{customAdd}</span>
          ) : (
            <span>Add&nbsp;{title}</span>
          )}
        </button>
      </div>
    </>
  );
};

export default DrawerButton;
