import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { formatEther, parseEther } from "viem";
import { PublicClient, useAccount, useConnect } from "wagmi";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { Spinner } from "~~/components/assets/Spinner";
import { rainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type FindNameProps = {
  pages: number;
  setPages: Dispatch<SetStateAction<number>>;
  publicClient: PublicClient;
  ensSubname: string;
};

export const RegisterName = ({ setPages, pages, publicClient, ensSubname }: FindNameProps) => {
  const accountState = useAccount();

  const getGasPrice = async (_newPrice: number) => {
    try {
      const priceEstimate = await publicClient.estimateGas({
        account: accountState.address,
        to: "0x0294af9d4332A1f88FBC18A41d85d2666Ec42343",
        value: parseEther(`${_newPrice}`),
      });

      console.log(priceEstimate);

      return formatEther(priceEstimate);
    } catch (error) {
      console.log(error);
    }
  };

  let [years, setYears] = useState<any>(1);
  let [priceLoading, setPriceLoading] = useState<boolean>(false);
  let [updatedPrice, setUpdatedPrice] = useState<number>(0.05);
  let [totalFee, setTotalFee] = useState<number | undefined>(0.05);
  let [gasPriceEstimate, setGasPriceEstimate] = useState<number | undefined>(0);
  let [durationTimestamp, setDurationTimestamp] = useState<bigint>(0n);

  const incrementYears = () => (years < 5 ? setYears(years + 1) : null);
  const decrementYears = () => (years > 1 ? setYears(years - 1) : null);

  const { userAddress } = rainbowKitCustomConnectButton();

  const price: number = 0.05;

  useEffect(() => {
    if (accountState.isConnected) {
      console.log(accountState.address);
    }

    console.log(new Date().setFullYear(new Date().getFullYear() + 5));
  }, [userAddress]);

  const handleYearsChange = async () => {
    setPriceLoading(true);

    let _durationTimestamp = new Date().setFullYear(new Date().getFullYear() + years);
    setDurationTimestamp(BigInt(_durationTimestamp));

    let newPrice = Math.round(price * years * 100) / 100;
    setUpdatedPrice(newPrice);

    let valueEstimateGasPrice: string | undefined = await getGasPrice(newPrice);

    setGasPriceEstimate(Number(valueEstimateGasPrice));

    setTotalFee(Number(valueEstimateGasPrice) + newPrice);

    setPriceLoading(false);
  };

  useEffect(() => {
    handleYearsChange();
  }, [years]);

  const viewVariables = () => {
    console.log(["remy", "onchain", accountState.address, 65536, durationTimestamp]);
  };

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "RegisterName",
    functionName: "newSubdomain",
    args: [ensSubname, "onchain", accountState.address, 65536, durationTimestamp],
    value: parseEther(String(updatedPrice)),
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <motion.div key={"homeCard"} initial={{ y: 5 }} transition={{ years: 0.1 }} animate={{ y: "0" }} exit={{ y: "0" }}>
      <div className="py-8 container max-w-[600px] mx-auto flex flex-col gap-y-3 justify-center items-center">
        <h3 className="text-2xl font-head font-semibold self-start">{ensSubname}.onchain.eth</h3>

        <div className="flex flex-col bg-base-100 pt-1  text-center  w-[600px] items-center  rounded-xl shadow-sm ">
          <div className=" py-2 px-6  w-full  text-left flex flex-col gap-y-3 ">
            <p className="font-body font-semibold text-xl ">Register {ensSubname}.onchain.eth</p>

            <div className="flex items-center justify-between border w-full py-2 px-3 rounded-full ">
              <MinusCircleIcon
                onClick={() => {
                  decrementYears();
                }}
                className="text-blue-500 w-14 cursor-pointer"
              />
              <div className="w-full py-0 px-[5px] flex text-[28px] items-center justify-center">
                <input
                  type="text"
                  className="bg-transparent font-semibold font-body text-3xl border-none w-full outline-none text-center rounded-full transition-all duration-150"
                  value={years + `${years > 1 ? " years" : " year"}`}
                  onChange={e => {
                    const sign = Math.sign(Number(e.target.value));
                    if (sign === -1 || isNaN(sign)) {
                      setYears(0);
                    } else {
                      setYears(e.target.value);
                    }
                  }}
                  disabled
                />
              </div>
              <PlusCircleIcon
                onClick={() => {
                  incrementYears();
                }}
                className="text-blue-500 w-14 cursor-pointer"
              />
            </div>

            <div className="bg-base-200 flex flex-col gap-y-2 rounded-xl px-4 py-4 my-3">
              {priceLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="flex justify-between font-body font-medium text-gray-500">
                    <h6>
                      {years} {years > 1 ? " years" : " year"} registration
                    </h6>{" "}
                    <h6>{updatedPrice} ETH</h6>
                  </div>
                  <div className="flex justify-between font-body font-medium text-gray-500">
                    <h6>Est. network fee</h6> <h6>{gasPriceEstimate} ETH</h6>
                  </div>
                  <div className="flex justify-between font-body font-medium ">
                    <h6>Estimated total</h6> <h6>{totalFee} ETH</h6>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-x-2 ">
              <p
                onClick={() => setPages(pages - 1)}
                className="py-3 w-[150px] btn btn-secondary flex items-centern justify-center text-center text-sm rounded-xl font-body font-medium cursor-pointer"
              >
                Back
              </p>
              {accountState.isConnected ? (
                <p
                  onClick={() => {
                    viewVariables();
                    writeAsync();
                  }}
                  className="py-3 w-[150px] btn btn-primary flex items-centern justify-center text-center text-sm rounded-xl font-body font-medium cursor-pointer"
                >
                  Proceed
                </p>
              ) : (
                <p className="py-3 w-[150px] btn btn-primary flex items-centern justify-center text-center text-sm rounded-xl font-body font-medium cursor-pointer">
                  Connect
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
