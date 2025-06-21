"use client";
import React from "react";
import { useAppContext } from "./context/appContext";
import Loading from "@/components/Loading";

const Home = () => {
  const { loading } = useAppContext();
  return (

      <div>
        {loading && <Loading />}
      </div>
  
  );
};

export default Home;
