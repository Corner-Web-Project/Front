import type { Dispatch, SetStateAction } from "react";

interface Props {
  selectedGeneration: string;
  setSelectedGeneration: Dispatch<SetStateAction<string>>;
}

const generations = [
  "1기",
  "2기",
  "3기",
  "4기",
];

export default function GenerationFilter({
  selectedGeneration,
  setSelectedGeneration,
}: Props) {
  return (
    <div className="mb-14 flex justify-center gap-8">

      {generations.map((generation) => (

        <button
          key={generation}
          onClick={() =>
            setSelectedGeneration(generation)
          }
         className={`rounded-xl border border-[#014BAA] px-8 py-3 font-bold transition-all duration-300

         ${
            selectedGeneration === generation
            ? "bg-[#014BAA] text-white scale-105 shadow-lg"
            : "bg-white text-[#014BAA] hover:bg-[#014BAA] hover:text-white hover:scale-105 hover:shadow-lg"
         }`}
        >
          {generation}
        </button>

      ))}

    </div>
  );
}