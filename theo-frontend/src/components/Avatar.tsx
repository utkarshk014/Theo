import { UserRound } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  src: string;
  width: number;
  height: number;
};

const Avatar = ({ src, width, height }: Props) => {
  return (
    <div className={`rounded-[50%] w-[${width}px] h-[${height}px]`}>
      {src != "" ? (
        <Image
          src={src}
          alt="avatar"
          className="rounded-[50%]"
          width={width}
          height={height}
        />
      ) : (
        <UserRound
          size={width}
          className="bg-white text-slate-600 rounded-[50%]"
        />
      )}
    </div>
  );
};

export default Avatar;
