import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import { PublicClient, createPublicClient, formatEther, formatGwei, http, parseEther } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { MetaHeader } from "~~/components/MetaHeader";
import { rainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { FindName } from "~~/components/subname/FindName";
import { RegisterName } from "~~/components/subname/RegisterName";
import scaffoldConfig from "~~/scaffold.config";

const Subname: NextPage = () => {
  const [pages, setPages] = useState<number>(0);
  const [ensSubname, setEnsSubname] = useState("");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`),
  });

  const componentArray = [
    <FindName
      publicClient={publicClient}
      setPages={setPages}
      pages={pages}
      setEnsSubname={setEnsSubname}
      ensSubname={ensSubname}
    />,
    <RegisterName publicClient={publicClient} setPages={setPages} pages={pages} ensSubname={ensSubname} />,
  ];

  return (
    <>
      <MetaHeader title="ENScheap | Get onchain with ENSCheap" description="Get a cheap ENS name and get onchain" />
      <AnimatePresence>{componentArray[pages]}</AnimatePresence>
    </>
  );
};

export default Subname;
