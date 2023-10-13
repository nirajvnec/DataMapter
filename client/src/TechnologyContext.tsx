import React, { createContext, ReactNode, useState } from "react";

interface TechnologyContextProps {
  sourceTechnology: string;
  setSourceTechnology: React.Dispatch<React.SetStateAction<string>>;
  destinationTechnology: string;
  setDestinationTechnology: React.Dispatch<React.SetStateAction<string>>;
}

export const TechnologyContext = createContext<
  TechnologyContextProps | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const TechnologyProvider: React.FC<Props> = ({ children }) => {
  const [sourceTechnology, setSourceTechnology] = useState<string>("");
  const [destinationTechnology, setDestinationTechnology] =
    useState<string>("");

  return (
    <TechnologyContext.Provider
      value={{
        sourceTechnology,
        setSourceTechnology,
        destinationTechnology,
        setDestinationTechnology,
      }}
    >
      {children}
    </TechnologyContext.Provider>
  );
};
