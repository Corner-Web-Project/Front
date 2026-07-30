interface GenerationFilterProps {
  selectedGeneration: string;
  setSelectedGeneration: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const generations = ["1기", "2기", "3기", "4기"];

export default function GenerationFilter({
  selectedGeneration,
  setSelectedGeneration,
}: GenerationFilterProps) {
  return (
    <div className="mb-10 flex justify-center border-b border-gray-200 pb-5">
      <div className="flex gap-2">
        {generations.map((generation) => (
          <button
            key={generation}
            onClick={() => setSelectedGeneration(generation)}
            className={`
              rounded-full
              px-5
              py-2
              text-sm
              font-medium
              transition-all
              duration-200
              shadow-sm
              ${
                selectedGeneration === generation
                  ? "bg-[#3B82F6] text-white ring-2 ring-blue-200 scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#014BAA]"
              }
            `}
          >
            {generation}
          </button>
        ))}
      </div>
    </div>
  );
}