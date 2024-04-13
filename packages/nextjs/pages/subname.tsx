import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { MetaHeader } from "~~/components/MetaHeader";
import { FindName } from "~~/components/subname/FindName";
import { RegisterName } from "~~/components/subname/RegisterName";

const Subname: NextPage = () => {
  const [pages, setPages] = useState<number>(0);

  const componentArray = [
    <FindName setPages={setPages} pages={pages} />,
    <RegisterName setPages={setPages} pages={pages} />,
  ];

  return (
    <>
      <MetaHeader
        title="Debug Contracts | Scaffold-ETH 2"
        description="Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way"
      />

      <AnimatePresence>{componentArray[pages]}</AnimatePresence>
    </>
  );
};

export default Subname;
