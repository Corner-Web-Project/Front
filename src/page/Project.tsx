import ProjectCard from "../components/ProjectCard";
import { projectData } from "../data/projectData";
import HeroSectionProject from "../components/HeroSectionProject";
import { useState } from "react";
import GenerationFilter from "../components/GenerationFilter";

export default function Project() {
  const [selectedGeneration, setSelectedGeneration] =
    useState("1기");

  return (
    <div className="mx-auto max-w-7xl p-10">
      <HeroSectionProject />
      <GenerationFilter
        selectedGeneration={selectedGeneration}
        setSelectedGeneration={setSelectedGeneration}
      />

      <h1 className="mb-10 text-4xl font-bold text-[#014BAA]">
        PROJECT
      </h1>

      <div className="grid grid-cols-2 gap-8">

        {projectData
          .filter(
            (project) =>
              project.generation ===
              selectedGeneration
          )
          .map((project) => (

          <ProjectCard
            key={project.id}
            project={project}
          />

        ))}

      </div>

    </div>
  );
}