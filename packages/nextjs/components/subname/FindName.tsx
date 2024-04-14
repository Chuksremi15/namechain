import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import Error from "next/error";
import { addEnsContracts } from "@ensdomains/ensjs";
import { ClientWithEns } from "@ensdomains/ensjs/dist/types/contracts/consts";
import { GetSubnamesReturnType, getSubnames } from "@ensdomains/ensjs/subgraph";
import { motion } from "framer-motion";
import { createPublicClient, http } from "viem";
import { GetEnsAddressReturnType, normalize } from "viem/ens";
import { PublicClient, sepolia } from "wagmi";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import useDebounce from "~~/hooks/customHook/useDebounce";
import scaffoldConfig from "~~/scaffold.config";

type FindNameProps = {
  pages: number;
  setPages: Dispatch<SetStateAction<number>>;
  publicClient: PublicClient;
};

export const FindName = ({ setPages, pages, publicClient }: FindNameProps) => {
  const [isValid, setIsValid] = useState(true);

  const [error, setError] = useState("");
  const [subnames, setSubnames] = useState<GetSubnamesReturnType[]>([]);
  const [getSubnamesLoading, setGetSubnamesLoading] = useState<boolean>(true);
  const [ensSubname, setEnsSubname] = useState("");
  const [ensname, setEnsname] = useState("");
  const [updatedInput, setUpdatedInput] = useState("");
  // const [ensAddress, setEnsAddress] = useState<GetEnsAddressReturnType>(null);
  const { currentValue, debouncedValue, setValue } = useDebounce(updatedInput, 500);

  const handleOnChange = async (e: string) => {
    try {
      //   setError("Enter a valid subname; exclude special characters and number");
      setEnsSubname(e);
      let normalizeInput = normalize(e + ".onchain.eth");
      setUpdatedInput(normalizeInput);
      setValue(normalizeInput);
      setError("");
    } catch (error: Error | any) {
      setError(error.toString());
    }
  };

  const ensPublicClient: ClientWithEns = createPublicClient({
    chain: addEnsContracts(sepolia),
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`),
  });

  useEffect(() => {
    const getSubnameOfOnchain = async () => {
      setGetSubnamesLoading(true);

      const result: GetSubnamesReturnType = await getSubnames(ensPublicClient, { name: "onchain.eth" });

      console.log(result);

      setSubnames([result]);

      setGetSubnamesLoading(false);

      console.log(subnames);
    };

    getSubnameOfOnchain();

    console.log(subnames);
  }, []);

  useEffect(() => {
    const checkForAvailability = async () => {
      try {
        console.log(ensAddress);
      } catch (error) {}
    };
    checkForAvailability();
  }, [debouncedValue]);

  const logSubnames = () => {
    console.log(subnames);
  };

  return (
    <motion.div
      key={"homeCard"}
      initial={{ y: 5 }}
      transition={{ duration: 0.1 }}
      animate={{ y: "0" }}
      exit={{ y: "0" }}
    >
      <div className="py-8 flex flex-col justify-center items-center">
        <h3 className=" text-4xl font-head font-semibold ">Your web3 username </h3>
        <p className="text-xl font-body  font-medium max-w-[500px] text-center">
          Your identity across web3, one name for all your crypto addresses, and your decentralised website.
        </p>

        <div className="flex flex-col gap-y-4">
          <input
            className="input rounded-xl h-16 focus:outline-blue-400 w-[450px]  focus:text-gray-400  px-4 border  font-medium placeholder:text-gray-400 placeholder:text-xl text-gray-400 transition-all duration-500"
            onChange={e => handleOnChange(e.target.value)}
            placeholder="Search a sub name"
          />

          <div className="flex flex-col bg-base-100 pt-1  text-center  w-[450px] items-center  rounded-xl shadow-sm ">
            <div className=" py-2 px-3  w-full  text-left flex items-center justify-between ">
              <div className="flex items-center gap-x-3">
                <div className="h-6 w-6 bg-blue-500 rounded-full" />
                <p onClick={logSubnames} className="font-body font-medium">
                  remy.onchain.eth
                </p>
              </div>
              <div className="flex gap-x-2">
                {isValid ? (
                  <div
                    onClick={() => setPages(pages + 1)}
                    className="btn btn-sm capitalize flex items-centern justify-center text-center text-sm bg-green-50 text-green-500 rounded-full  font-body font-medium cursor-pointer"
                  >
                    Available
                    <ChevronRightIcon className="h-5" />
                  </div>
                ) : (
                  <p className="text-sm btn btn-sm bg-red-50 text-red-500 rounded-full w-[60px] text-center font-body font-medium">
                    Invalid
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
