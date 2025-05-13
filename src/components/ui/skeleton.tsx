import React from "react";
import { cn } from "@/lib/utils"

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`}></div>
);

export default Skeleton;
