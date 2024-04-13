import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";

type FindNameProps = {
  pages: number;
  setPages: Dispatch<SetStateAction<number>>;
};

export const RegisterName = ({ setPages, pages }: FindNameProps) => {
  let [years, setYears] = useState<any>(1);

  const incrementYears = () => (years < 5 ? setYears(years + 1) : null);
  const decrementYears = () => (years > 1 ? setYears(years - 1) : null);

  return (
    <motion.div key={"homeCard"} initial={{ y: 5 }} transition={{ years: 0.1 }} animate={{ y: "0" }} exit={{ y: "0" }}>
      <div className="py-8 container max-w-[600px] mx-auto flex flex-col gap-y-3 justify-center items-center">
        <h3 className="text-2xl font-head font-semibold self-start">remy.eth</h3>

        <div className="flex flex-col bg-base-100 pt-1  text-center  w-[600px] items-center  rounded-xl shadow-sm ">
          <div className=" py-2 px-6  w-full  text-left flex flex-col gap-y-3 ">
            <p className="font-body font-semibold text-xl ">Register Remy.eth</p>

            <div className="flex items-center justify-between border w-full py-2 px-3 rounded-full ">
              <MinusCircleIcon onClick={decrementYears} className="text-blue-500 w-14 cursor-pointer" />
              <div className="w-full py-0 px-[5px] flex text-[28px] items-center justify-center">
                <input
                  type="text"
                  className="bg-transparent text-3xl border-none w-full outline-none text-center hover:bg-blue-50  rounded-full transition-all duration-150"
                  value={years + " year"}
                  onChange={e => {
                    const sign = Math.sign(Number(e.target.value));
                    if (sign === -1 || isNaN(sign)) {
                      setYears(0);
                    } else {
                      setYears(e.target.value);
                    }
                  }}
                />
              </div>
              <PlusCircleIcon onClick={incrementYears} className="text-blue-500 w-14 cursor-pointer" />
            </div>

            <div className="bg-base-200 flex flex-col gap-y-2 rounded-xl px-4 py-4 my-3">
              <div className="flex justify-between font-body font-medium text-gray-500">
                <h6>1 year registration</h6> <h6>0.5774 ETH</h6>
              </div>
              <div className="flex justify-between font-body font-medium text-gray-500">
                <h6>Est. network fee</h6> <h6>0.5774 ETH</h6>
              </div>
              <div className="flex justify-between font-body font-medium ">
                <h6>Estimated total</h6> <h6>0.5774 ETH</h6>
              </div>
            </div>

            <div className="flex items-center justify-center gap-x-2 ">
              <p
                onClick={() => setPages(pages - 1)}
                className="py-3 w-[150px] btn btn-secondary flex items-centern justify-center text-center text-sm rounded-xl font-body font-medium cursor-pointer"
              >
                Back
              </p>
              <p className="py-3 w-[150px] btn btn-primary flex items-centern justify-center text-center text-sm rounded-xl font-body font-medium cursor-pointer">
                Connect
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
