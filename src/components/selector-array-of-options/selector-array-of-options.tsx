import React from "react";
import Button from "../button/button";
import { useSelectorHook } from "./use-selector-array-of-options";

type SelectorArrayOfOptionsProps = {
  data: string[];
  onSubmit?: Function;
  questionId?: any;
  containerClassName?: string;
  slideIndexCount?: any;
  handleSelect?: Function;
  buttonClassName?: string;
  buttonContainerClassName?: string;
  id?: string;
};

const SelectorArrayOfOptions = ({
  data,
  onSubmit,
  containerClassName,
  slideIndexCount,
  questionId,
  handleSelect,
  buttonClassName,
  buttonContainerClassName,
  id,
}: SelectorArrayOfOptionsProps) => {
  const { handleClick } = useSelectorHook({ onSubmit });

  const handleSelectFromProps = (value: any) => {
    if (handleSelect) {
      handleSelect({ value });
    }
  };

  return (
    <div
      id={id}
      className={`flex w-full flex-wrap items-start gap-2 ${containerClassName}`}
    >
      {data?.length &&
        data?.map((item, index) => {
          return (
            <div
              className={`box-border flex h-[28px] cursor-pointer items-center  justify-center rounded border border-[#b2ddff] bg-white px-2 py-1 hover:bg-[#EFF8FF] focus:bg-[#EFF8FF] md:h-8 ${buttonContainerClassName}`}
              key={index}
            >
              <Button
                variant="custom"
                className={`h-[18px] max-w-[320px] overflow-x-hidden whitespace-nowrap !px-0 text-xs font-medium leading-[1.125rem] text-[#2e90fa] ${buttonClassName}`}
                onClick={
                  handleSelect
                    ? () => handleSelectFromProps(item)
                    : () => handleClick(item, questionId, slideIndexCount)
                }
              >
                {item}
              </Button>
            </div>
          );
        })}
    </div>
  );
};

export default SelectorArrayOfOptions;
