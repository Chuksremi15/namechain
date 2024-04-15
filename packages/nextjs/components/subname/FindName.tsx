import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { addEnsContracts } from "@ensdomains/ensjs";
import { ClientWithEns } from "@ensdomains/ensjs/dist/types/contracts/consts";
import { GetSubnamesReturnType, getSubnames } from "@ensdomains/ensjs/subgraph";
import { motion } from "framer-motion";
import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { PublicClient, sepolia } from "wagmi";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import useDebounce from "~~/hooks/customHook/useDebounce";
import scaffoldConfig from "~~/scaffold.config";

type FindNameProps = {
  pages: number;
  setPages: Dispatch<SetStateAction<number>>;
  setEnsSubname: Dispatch<SetStateAction<string>>;
  publicClient: PublicClient;
  ensSubname: string;
};

export const FindName = ({ setPages, pages, setEnsSubname }: FindNameProps) => {
  const [isValid, setIsValid] = useState(true);

  const [error, setError] = useState("");
  const [subnames, setSubnames] = useState<GetSubnamesReturnType[]>([]);
  const [getSubnamesLoading, setGetSubnamesLoading] = useState<boolean>(true);
  const [updatedInput, setUpdatedInput] = useState("");
  // const [ensAddress, setEnsAddress] = useState<GetEnsAddressReturnType>(null);
  const { debouncedValue, setValue } = useDebounce(updatedInput, 500);

  const handleOnChange = async (e: string) => {
    try {
      //   setError("Enter a valid subname; exclude special characters and number");

      const normalizeInput = normalize(e);
      setEnsSubname(normalizeInput);
      setUpdatedInput(normalizeInput + ".onchain.eth");
      setValue(e);
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

      setSubnames([result]);

      setGetSubnamesLoading(false);
    };

    getSubnameOfOnchain();
  }, []);

  useEffect(() => {
    const checkForAvailability = async () => {
      try {
        for (let i = 0; i < subnames[0].length; i++) {
          if (debouncedValue === subnames[0][i].labelName) {
            console.log("134");
            setIsValid(false);
            return;
          } else {
            setIsValid(true);
          }
        }
      } catch (error) {}
    };
    checkForAvailability();
  }, [debouncedValue]);

  return (
    <motion.div
      key={"homeCard"}
      initial={{ y: 5 }}
      transition={{ duration: 0.1 }}
      animate={{ y: "0" }}
      exit={{ y: "0" }}
    >
      <div className="py-8 flex flex-col justify-center items-center">
        <h3 className=" text-4xl font-head font-semibold ">Your 3LD web3 username </h3>
        <p className="text-xl font-body  font-medium max-w-[600px] text-center">
          ENScheap allows you to own an 3LD ENS name for as low as 0.05ETH a year. The PARENT_CANNOT_CONTROL fuse is
          burned alongside the registration so your 3DL domain name is Emancipated and you have full control.
        </p>

        <div className="flex flex-col gap-y-4">
          <input
            className="input rounded-xl h-16 focus:outline-blue-400 w-[450px]  focus:text-gray-400  px-4 border  font-medium placeholder:text-gray-400 placeholder:text-xl text-gray-400 transition-all duration-500"
            onChange={e => handleOnChange(e.target.value)}
            disabled={getSubnamesLoading}
            placeholder="Search a sub name"
          />

          {updatedInput && (
            <div className="flex flex-col bg-base-100 pt-1  text-center  w-[450px] items-center  rounded-xl shadow-sm ">
              <div className=" py-2 px-3  w-full  text-left flex items-center justify-between ">
                <div className="flex items-center gap-x-3">
                  <div className="h-6 w-6 bg-blue-500 rounded-full" />
                  <p className="font-body font-medium">{updatedInput}</p>
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
                    <p className="btn btn-sm capitalize bg-red-50 text-red-500 rounded-full w-[130px] text-sm text-center font-body font-medium">
                      Not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
