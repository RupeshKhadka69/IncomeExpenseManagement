import { Dialog, Transition ,TransitionChild,DialogPanel,DialogTitle } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";

const DialogModal = ({
  open,
  setOpen,
  title,
  body,
  modalBackground = "",
  titleClassName = "",
  showOverflow = false,
}) => {
  return (
    <div>
      <Transition show={open ? true : false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 overflow-y-auto bottom-20">
            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel
                  className={` ${
                    modalBackground ? modalBackground : "bg-white"
                  } relative transform ${
                    showOverflow ? "" : "overflow-y-auto"
                  }  rounded-lg pb-4 text-left shadow-xl transition-all sm:my-3 sm:w-full sm:max-w-lg`}
                >
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md hover:text-gray-500 focus:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <IoClose className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                  <DialogTitle
                    as="h3"
                    className={`h-12 pt-3 text-base font-bold text-center ${titleClassName}`}
                  >
                    {title}
                  </DialogTitle>
                  {body}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DialogModal;
