import React, { useEffect, useState } from "react";
import { addEnsContracts } from "@ensdomains/ensjs";
import { ClientWithEns } from "@ensdomains/ensjs/dist/types/contracts/consts";
import { GetSubnamesReturnType, getSubnames } from "@ensdomains/ensjs/subgraph";
import type { NextPage } from "next";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/assets/Spinner";
import scaffoldConfig from "~~/scaffold.config";

const MyNames: NextPage = () => {
  const [getSubnamesLoading, setGetSubnamesLoading] = useState<boolean>(true);
  const [userNames, setUserNames] = useState<Array<string | null>>([]);

  const accountState = useAccount();

  const ensPublicClient: ClientWithEns = createPublicClient({
    chain: addEnsContracts(sepolia),
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`),
  });

  const getSubnameOfOnchain = async () => {
    setGetSubnamesLoading(true);
    const result: GetSubnamesReturnType = await getSubnames(ensPublicClient, { name: "onchain.eth" });

    const myNameArr: Array<string | null> = [];

    result.forEach(({ wrappedOwner, labelName }) => {
      if (wrappedOwner === accountState.address) {
        myNameArr.push(labelName);
        setUserNames(myNameArr);
      }
    });

    setGetSubnamesLoading(false);
  };

  useEffect(() => {
    getSubnameOfOnchain();
  }, [accountState.address]);

  return (
    <>
      <MetaHeader title="ENScheap | Get onchain with ENSCheap" description="Get a cheap ENS name and get onchain" />
      <div className="py-8 container max-w-[600px] mx-auto flex flex-col gap-y-3 justify-center items-center">
        <h3 className="text-2xl font-head font-semibold self-start">Names</h3>

        <div className="flex flex-col  bg-base-100 py-4  text-center  w-[600px] items-center  rounded-xl overflow-hidden shadow-sm ">
          {getSubnamesLoading ? (
            <div className="flex justify-center items-center py-10">
              <Spinner />
            </div>
          ) : userNames.length < 1 ? (
            <div></div>
          ) : (
            userNames.map((label, index) => (
              <div
                key={index}
                className="flex justify-between w-full border-b bg-base-100 pt-1  px-4 text-center  shadow-sm "
              >
                <div className="flex items-center gap-x-3">
                  <div className="h-6 w-6 bg-blue-500 rounded-full" />
                  <p className="font-body font-medium">{label}.onchain.eth</p>
                </div>

                <div>
                  <p className="btn btn-xs capitalize bg-green-50  text-green-500 rounded-full w-[70px] text-xs text-center font-body font-medium">
                    owner
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyNames;
